import { resend, EMAIL_CONFIG, isEmailConfigured } from '@/lib/email/config';
import {
  contactConfirmationTemplate,
  adminContactNotificationTemplate,
  bookingConfirmationTemplate,
  adminBookingNotificationTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
  bookingReminderTemplate,
} from '@/lib/email/templates';
import type {
  ContactConfirmationData,
  AdminContactNotificationData,
  BookingConfirmationData,
  AdminBookingNotificationData,
  BookingStatusUpdateData,
  BookingReminderData,
} from '@/lib/email/types';

class EmailServiceError extends Error {
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'EmailServiceError';
    this.cause = cause;
  }
}

export class EmailService {
  async sendContactConfirmation(to: string, data: ContactConfirmationData): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping contact confirmation');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: 'We received your message! ✨',
        html: contactConfirmationTemplate(data),
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log(`[EmailService] Contact confirmation sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send contact confirmation:', error);
      throw new EmailServiceError('Failed to send confirmation email', error);
    }
  }

  async sendAdminContactNotification(
    to: string,
    data: AdminContactNotificationData
  ): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping admin notification');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: `📬 New contact: ${data.contact.subject || data.contact.name}`,
        html: adminContactNotificationTemplate(data),
      });

      console.log(`[EmailService] Admin contact notification sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send admin contact notification:', error);
      throw new EmailServiceError('Failed to send admin notification email', error);
    }
  }

  async sendBookingConfirmation(to: string, data: BookingConfirmationData): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping booking confirmation');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: '📅 Booking Request Received',
        html: bookingConfirmationTemplate(data),
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log(`[EmailService] Booking confirmation sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send booking confirmation:', error);
      throw new EmailServiceError('Failed to send booking confirmation email', error);
    }
  }

  async sendAdminBookingNotification(
    to: string,
    data: AdminBookingNotificationData
  ): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping admin booking notification');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: `📅 New booking: ${data.booking.name} - ${data.booking.date} ${data.booking.time}`,
        html: adminBookingNotificationTemplate(data),
      });

      console.log(`[EmailService] Admin booking notification sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send admin booking notification:', error);
      throw new EmailServiceError('Failed to send admin booking notification email', error);
    }
  }

  async sendBookingConfirmed(to: string, data: BookingStatusUpdateData): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping booking confirmed email');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: '✅ Your Booking is Confirmed!',
        html: bookingConfirmedTemplate(data),
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log(`[EmailService] Booking confirmed email sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send booking confirmed email:', error);
      throw new EmailServiceError('Failed to send booking confirmed email', error);
    }
  }

  async sendBookingRejected(to: string, data: BookingStatusUpdateData): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping booking rejected email');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: 'Booking Status Update',
        html: bookingRejectedTemplate(data),
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log(`[EmailService] Booking rejected email sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send booking rejected email:', error);
      throw new EmailServiceError('Failed to send booking rejected email', error);
    }
  }

  async sendBookingReminder(to: string, data: BookingReminderData): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn('[EmailService] Email not configured, skipping booking reminder');
      return;
    }

    const client = resend;
    if (!client) {
      return;
    }

    try {
      await client.emails.send({
        from: EMAIL_CONFIG.from,
        to,
        subject: '📅 Reminder: Your booking is coming up soon!',
        html: bookingReminderTemplate(data),
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log(`[EmailService] Booking reminder sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send booking reminder:', error);
      throw new EmailServiceError('Failed to send booking reminder email', error);
    }
  }
}

export const emailService = new EmailService();
