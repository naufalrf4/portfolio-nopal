import { EMAIL_CONFIG, getEmailTransporter, isEmailConfigured } from '@/lib/email/config';
import {
  contactConfirmationTemplate,
  contactReplyTemplate,
  adminContactNotificationTemplate,
  bookingConfirmationTemplate,
  adminBookingNotificationTemplate,
  bookingConfirmedTemplate,
  bookingRejectedTemplate,
} from '@/lib/email/templates';
import type {
  ContactConfirmationData,
  ContactReplyData,
  AdminContactNotificationData,
  BookingConfirmationData,
  AdminBookingNotificationData,
  BookingStatusUpdateData,
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
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!isEmailConfigured()) {
      console.warn(`[EmailService] SMTP not configured, skipping email: ${subject}`);
      return;
    }

    const transporter = getEmailTransporter();
    if (!transporter) {
      return;
    }

    try {
      await transporter.sendMail({
        from: EMAIL_CONFIG.from,
        to,
        subject,
        html,
      });
    } catch (error) {
      throw new EmailServiceError(`Failed to send email: ${subject}`, error);
    }
  }

  async sendContactConfirmation(to: string, data: ContactConfirmationData): Promise<void> {
    try {
      await this.sendEmail(to, 'Message received', contactConfirmationTemplate(data));
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
    try {
      await this.sendEmail(
        to,
        `New contact message: ${data.contact.subject || data.contact.name}`,
        adminContactNotificationTemplate(data)
      );
      console.log(`[EmailService] Admin contact notification sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send admin contact notification:', error);
      throw new EmailServiceError('Failed to send admin notification email', error);
    }
  }

  async sendContactReply(to: string, data: ContactReplyData): Promise<void> {
    try {
      await this.sendEmail(to, data.replySubject, contactReplyTemplate(data));
      console.log(`[EmailService] Contact reply sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send contact reply:', error);
      throw new EmailServiceError('Failed to send contact reply email', error);
    }
  }

  async sendBookingConfirmation(to: string, data: BookingConfirmationData): Promise<void> {
    try {
      await this.sendEmail(to, 'Booking request received', bookingConfirmationTemplate(data));
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
    try {
      await this.sendEmail(
        to,
        `New booking request: ${data.booking.name}`,
        adminBookingNotificationTemplate(data)
      );
      console.log(`[EmailService] Admin booking notification sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send admin booking notification:', error);
      throw new EmailServiceError('Failed to send admin booking notification email', error);
    }
  }

  async sendBookingConfirmed(to: string, data: BookingStatusUpdateData): Promise<void> {
    try {
      await this.sendEmail(to, 'Booking confirmed', bookingConfirmedTemplate(data));
      console.log(`[EmailService] Booking confirmed email sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send booking confirmed email:', error);
      throw new EmailServiceError('Failed to send booking confirmed email', error);
    }
  }

  async sendBookingRejected(to: string, data: BookingStatusUpdateData): Promise<void> {
    try {
      await this.sendEmail(to, 'Booking update', bookingRejectedTemplate(data));
      console.log(`[EmailService] Booking rejected email sent to ${to}`);
    } catch (error) {
      console.error('[EmailService] Failed to send booking rejected email:', error);
      throw new EmailServiceError('Failed to send booking rejected email', error);
    }
  }
}

export const emailService = new EmailService();
