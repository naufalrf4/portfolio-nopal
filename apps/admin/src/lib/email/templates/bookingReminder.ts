import { emailLayout } from './layout';
import type { BookingReminderData } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): string {
  const { bookingId, name, date, time, duration, hoursUntil } = data;

  const content = `
    <div class="header">
      <h1>📅 Booking Reminder</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>This is a friendly reminder about your upcoming booking in <strong>${hoursUntil} hours</strong>.</p>
      
      <div class="info-box">
        <p><strong>Booking ID:</strong> <span class="reference-id">#${bookingId.slice(0, 8).toUpperCase()}</span></p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
      </div>

      <p>Looking forward to meeting with you!</p>

      <hr class="divider" />

      <p style="color: #888; font-size: 14px;">
        <strong>Need to reschedule?</strong> Please contact me as soon as possible.
      </p>
    </div>
  `;

  return emailLayout(content);
}
