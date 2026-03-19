import type { ContactConfirmationData } from '../types';
import { formatReference } from './helper';
import { renderCard, renderDetailList, renderHeader, renderMeta } from './partials';
import { emailLayout } from './layout';

export function contactConfirmationTemplate(data: ContactConfirmationData): string {
  const content = `
    ${renderHeader('Message received', 'Thanks for reaching out. I have your message and will review it soon.')}
    <div class="content">
      ${renderCard(
        renderDetailList([
          { label: 'Reference', value: formatReference(data.messageId) },
          { label: 'Received', value: data.receivedAt },
          { label: 'Subject', value: data.subject || 'General inquiry' },
        ])
      )}
      ${renderMeta('You will usually get a reply within 1-2 business days.')}
    </div>
  `;

  return emailLayout({
    preheader: 'Your message has been received.',
    content,
  });
}
