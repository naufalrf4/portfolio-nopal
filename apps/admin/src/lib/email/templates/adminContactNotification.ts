import { emailLayout } from './layout';
import type { AdminContactNotificationData } from '../types';

export function adminContactNotificationTemplate(data: AdminContactNotificationData): string {
  const { contact, dashboardLink, receivedAt } = data;

  const content = `
    <div class="header">
      <h1>📬 New Contact Submission</h1>
    </div>
    <div class="content">
      <h2>New message from ${contact.name}</h2>
      
      <div class="info-box">
        <p><strong>From:</strong> ${contact.name} (${contact.email})</p>
        ${contact.subject ? `<p><strong>Subject:</strong> ${contact.subject}</p>` : ''}
        ${contact.city || contact.country ? `<p><strong>Location:</strong> ${[contact.city, contact.country].filter(Boolean).join(', ')}</p>` : ''}
        <p><strong>Received:</strong> ${receivedAt}</p>
        <p><strong>ID:</strong> <span class="reference-id">${contact.id.slice(0, 8).toUpperCase()}</span></p>
      </div>

      <div class="message-preview">
        <p style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${contact.message}</p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${dashboardLink}" class="button">View in Dashboard</a>
      </div>
    </div>
  `;

  return emailLayout(content);
}
