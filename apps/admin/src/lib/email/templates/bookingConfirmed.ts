import { emailLayout } from './layout';
import type { BookingStatusUpdateData } from '../types';

export function bookingConfirmedTemplate(data: BookingStatusUpdateData): string {
  const { bookingId, name, date, time, duration, message } = data;

  const content = `
    <div class="header">
      <h1>✅ Booking Confirmed!</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Great news! Your booking has been confirmed.</p>
      
      <div class="info-box">
        <p><strong>Booking ID:</strong> <span class="reference-id">#${bookingId.slice(0, 8).toUpperCase()}</span></p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        <p><strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">CONFIRMED</span></p>
      </div>

      ${
        message
          ? `
      <div class="message-preview">
        <p style="margin: 0; font-weight: 600; color: #666; font-size: 14px; margin-bottom: 8px;">Message from me:</p>
        <p style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
      </div>
      `
          : ''
      }

      <p>Looking forward to meeting with you!</p>

      <hr class="divider" />

      <p style="color: #888; font-size: 14px;">
        <strong>Need to make changes?</strong> Please reply to this email or contact me directly.
      </p>
    </div>
  `;

  return emailLayout(content);
}
