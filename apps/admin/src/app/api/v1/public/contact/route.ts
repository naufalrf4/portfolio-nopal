import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { db } from '@/lib/db';
import { contactForms, contactSettings } from '@/lib/db/schema';
import { z } from 'zod';
import { getIpLocation } from '@/lib/services/geoIpService';
import { hashIp } from '@/lib/utils/hash';
import { emailService } from '@/lib/services/emailService';
import { createId } from '@paralleldrive/cuid2';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded?.split(',')[0]?.trim() || 'unknown';
    const geoLocation = getIpLocation(clientIp);
    const ipHashValue = hashIp(clientIp);

    const now = new Date().toISOString();
    const [contact] = await db
      .insert(contactForms)
      .values({
        id: createId(),
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        ipHash: ipHashValue,
        ipAddress: clientIp !== 'unknown' ? clientIp : null,
        countryCode: geoLocation?.countryCode || null,
        country: geoLocation?.country || null,
        city: geoLocation?.city || null,
        region: geoLocation?.region || null,
        read: false,
        replied: false,
        createdAt: now,
        updatedAt: now,
      } as any)
      .returning();

    try {
      await emailService.sendContactConfirmation(parsed.data.email, {
        name: parsed.data.name,
        subject: parsed.data.subject,
        messageId: contact.id,
        receivedAt: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Asia/Jakarta',
        }),
      });
    } catch (emailError) {
      console.error('[Contact API] User confirmation email failed:', emailError);
    }

    try {
      const settingsResult = await db.select().from(contactSettings).limit(1);
      const settings = settingsResult[0];

      if (settings?.notificationEmail) {
        await emailService.sendAdminContactNotification(settings.notificationEmail, {
          contact: {
            id: contact.id,
            name: parsed.data.name,
            email: parsed.data.email,
            subject: parsed.data.subject,
            message: parsed.data.message,
            country: geoLocation?.country,
            city: geoLocation?.city,
          },
          dashboardLink: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/admin/contacts/${contact.id}`,
          receivedAt: new Date().toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'Asia/Jakarta',
          }),
        });
      }
    } catch (emailError) {
      console.error('[Contact API] Admin notification email failed:', emailError);
    }

    return successResponse(contact, 'Message sent successfully');
  } catch {
    return serverErrorResponse();
  }
}
