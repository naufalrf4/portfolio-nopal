import { emailLayout } from './layout';
import type { BookingConfirmationData } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): string {
  const { bookingId, name, date, time, duration } = data;

  const content = `
    <div class="header">
      <h1>📅 Booking Request Received</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Thank you for your booking request! I've received your submission and will review it shortly.</p>
      
      <div class="info-box">
        <p><strong>Booking ID:</strong> <span class="reference-id">#${bookingId.slice(0, 8).toUpperCase()}</span></p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: 600;">PENDING CONFIRMATION</span></p>
      </div>

      <p>You will receive another email once your booking has been confirmed or if any changes are needed.</p>

      <hr class="divider" />

      <p style="color: #888; font-size: 14px;">
        <strong>Please note:</strong> Your booking is not confirmed until you receive a confirmation email.
      </p>
    </div>
  `;

  return emailLayout(content);
}
