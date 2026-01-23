import { emailLayout } from './layout';
import type { BookingStatusUpdateData } from '../types';

export function bookingRejectedTemplate(data: BookingStatusUpdateData): string {
  const { bookingId, name, date, time, message } = data;

  const content = `
    <div class="header">
      <h1>Booking Status Update</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Thank you for your booking request. Unfortunately, the requested time slot is no longer available.</p>
      
      <div class="info-box">
        <p><strong>Booking ID:</strong> <span class="reference-id">#${bookingId.slice(0, 8).toUpperCase()}</span></p>
        <p><strong>Requested Date:</strong> ${date}</p>
        <p><strong>Requested Time:</strong> ${time}</p>
        <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: 600;">NOT AVAILABLE</span></p>
      </div>

      ${
        message
          ? `
      <div class="message-preview">
        <p style="margin: 0; font-weight: 600; color: #666; font-size: 14px; margin-bottom: 8px;">Reason:</p>
        <p style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
      </div>
      `
          : ''
      }

      <p>I apologize for any inconvenience. Please feel free to select another available time slot that works for you.</p>

      <hr class="divider" />

      <p style="color: #888; font-size: 14px;">
        <strong>Questions?</strong> Please reply to this email or contact me directly.
      </p>
    </div>
  `;

  return emailLayout(content);
}
