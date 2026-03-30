import { escapeHtml, preserveLineBreaks } from './helper';

type DetailItem = {
  label: string;
  value: string;
};

type ButtonTone = 'primary' | 'neutral' | 'danger';
type StatusTone = 'info' | 'success' | 'danger' | 'warning';

const buttonToneStyles: Record<ButtonTone, string> = {
  primary: 'background:#1d4ed8;color:#ffffff;',
  neutral: 'background:#e8eef9;color:#16355d;',
  danger: 'background:#c2410c;color:#ffffff;',
};

const statusToneStyles: Record<StatusTone, string> = {
  info: 'background:#dbeafe;color:#1d4ed8;',
  success: 'background:#dcfce7;color:#166534;',
  danger: 'background:#fee2e2;color:#b91c1c;',
  warning: 'background:#fef3c7;color:#92400e;',
};

export function renderHeader(title: string, intro: string): string {
  return `
    <div class="hero">
      <p class="eyebrow">NaufalRF Portfolio</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="hero-copy">${escapeHtml(intro)}</p>
    </div>
  `;
}

export function renderCard(content: string): string {
  return `<div class="card">${content}</div>`;
}

export function renderDetailList(items: DetailItem[]): string {
  const rows = items
    .filter((item) => item.value)
    .map(
      (item) => `
        <tr>
          <td class="detail-label">${escapeHtml(item.label)}</td>
          <td class="detail-value">${item.value}</td>
        </tr>
      `
    )
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="details-table">
      ${rows}
    </table>
  `;
}

export function renderStatusBadge(label: string, tone: StatusTone): string {
  return `<span class="status-badge" style="${statusToneStyles[tone]}">${escapeHtml(label)}</span>`;
}

export function renderMessageBlock(label: string, message: string): string {
  return `
    <div class="message-block">
      <p class="message-label">${escapeHtml(label)}</p>
      <p class="message-body">${preserveLineBreaks(message)}</p>
    </div>
  `;
}

export function renderButton(href: string, label: string, tone: ButtonTone = 'primary'): string {
  return `<a href="${escapeHtml(href)}" class="button" style="${buttonToneStyles[tone]}">${escapeHtml(label)}</a>`;
}

export function renderButtonGroup(buttons: string[]): string {
  return `<div class="button-group">${buttons.join('')}</div>`;
}

export function renderMeta(text: string): string {
  return `<p class="meta-note">${escapeHtml(text)}</p>`;
}
