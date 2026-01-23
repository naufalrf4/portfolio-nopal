import { emailLayout } from './layout';
import type { AdminBookingNotificationData } from '../types';

export function adminBookingNotificationTemplate(data: AdminBookingNotificationData): string {
  const { booking, dashboardLink, acceptLink, rejectLink } = data;

  const content = `
    <div class="header">
      <h1>📅 New Booking Request</h1>
    </div>
    <div class="content">
      <h2>New booking from ${booking.name}</h2>
      
      <div class="info-box">
        <p><strong>Name:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        ${booking.phone ? `<p><strong>Phone:</strong> ${booking.phone}</p>` : ''}
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>ID:</strong> <span class="reference-id">${booking.id.slice(0, 8).toUpperCase()}</span></p>
      </div>

      ${
        booking.notes
          ? `
      <div class="message-preview">
        <p style="margin: 0; font-weight: 600; color: #666; font-size: 14px; margin-bottom: 8px;">Notes from client:</p>
        <p style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${booking.notes}</p>
      </div>
      `
          : ''
      }

      <div style="text-align: center; margin-top: 30px;">
        <a href="${acceptLink}" class="button success">✓ Accept Booking</a>
        <a href="${rejectLink}" class="button danger">✗ Reject Booking</a>
      </div>

      <div style="text-align: center; margin-top: 15px;">
        <a href="${dashboardLink}" class="button">View in Dashboard</a>
      </div>
    </div>
  `;

  return emailLayout(content);
}
