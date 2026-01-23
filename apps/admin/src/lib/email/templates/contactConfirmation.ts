import { emailLayout } from './layout';
import type { ContactConfirmationData } from '../types';

export function contactConfirmationTemplate(data: ContactConfirmationData): string {
  const content = `
    <div class="header">
      <h1>✨ We received your message!</h1>
    </div>
    <div class="content">
      <h2>Hi ${data.name},</h2>
      <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
      
      <div class="info-box">
        <p><strong>Message Reference:</strong> <span class="reference-id">#${data.messageId.slice(0, 8).toUpperCase()}</span></p>
        <p><strong>Received at:</strong> ${data.receivedAt}</p>
        ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
      </div>

      <p>I typically respond within 24-48 hours. If your message is urgent, please feel free to reach out through other channels.</p>

      <hr class="divider" />

      <p style="color: #888; font-size: 14px;">
        If you didn't send this message, please ignore this email.
      </p>
    </div>
  `;

  return emailLayout(content);
}
