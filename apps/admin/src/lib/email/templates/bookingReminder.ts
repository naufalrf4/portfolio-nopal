import type { BookingReminderData } from '../types';
import { formatDuration, formatReference } from './helper';
import { renderCard, renderDetailList, renderHeader, renderMeta } from './partials';
import { emailLayout } from './layout';

export function bookingReminderTemplate(data: BookingReminderData): string {
  const { bookingId, date, time, duration, hoursUntil } = data;

  const content = `
    ${renderHeader('Booking reminder', `Your session starts in about ${hoursUntil} hours.`)}
    <div class="content">
      ${renderCard(
        renderDetailList([
          { label: 'Reference', value: formatReference(bookingId) },
          { label: 'Date', value: date },
          { label: 'Time', value: time },
          { label: 'Duration', value: formatDuration(duration) },
        ])
      )}
      ${renderMeta('If timing changed, please reach out as soon as possible.')}
    </div>
  `;

  return emailLayout({
    preheader: 'A reminder for your upcoming booking.',
    content,
  });
}
