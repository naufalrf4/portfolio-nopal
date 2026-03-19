import { escapeHtml } from './helper';

type EmailLayoutOptions = {
  preheader: string;
  content: string;
};

export function emailLayout({ preheader, content }: EmailLayoutOptions): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NaufalRF</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #eef3fb;
      color: #16355d;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      opacity: 0;
      color: transparent;
      height: 0;
      width: 0;
      overflow: hidden;
      mso-hide: all;
    }
    .shell {
      width: 100%;
      padding: 24px 12px;
      box-sizing: border-box;
    }
    .frame {
      max-width: 640px;
      margin: 0 auto;
      background: #f8fbff;
      border: 1px solid #d7e3f4;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 18px 18px 36px rgba(180, 196, 219, 0.38), -18px -18px 36px rgba(255, 255, 255, 0.9);
    }
    .top-line {
      height: 6px;
      background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
    }
    .hero {
      padding: 32px 32px 12px;
    }
    .eyebrow {
      margin: 0 0 10px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #2563eb;
    }
    .hero h1 {
      margin: 0 0 12px;
      font-size: 30px;
      line-height: 1.15;
      color: #102a4c;
    }
    .hero-copy {
      margin: 0;
      font-size: 15px;
      line-height: 1.6;
      color: #47688f;
    }
    .content {
      padding: 0 32px 32px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #dfe9f6;
      border-radius: 22px;
      padding: 20px;
      box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.95), 0 12px 30px rgba(184, 200, 221, 0.16);
      margin-top: 16px;
    }
    .details-table {
      border-collapse: collapse;
    }
    .details-table tr + tr td {
      border-top: 1px solid #ebf1f8;
    }
    .detail-label,
    .detail-value {
      padding: 12px 0;
      vertical-align: top;
      font-size: 14px;
      line-height: 1.5;
    }
    .detail-label {
      width: 38%;
      color: #6a87ac;
      padding-right: 16px;
    }
    .detail-value {
      color: #102a4c;
      font-weight: 600;
      word-break: break-word;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .message-block {
      margin-top: 16px;
      padding: 16px 18px;
      border-radius: 18px;
      background: #f4f8fd;
      border: 1px solid #dfe9f6;
    }
    .message-label {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5b7da6;
    }
    .message-body {
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
      color: #1b3658;
    }
    .button-group {
      margin-top: 18px;
      text-align: left;
    }
    .button {
      display: inline-block;
      margin: 0 12px 12px 0;
      padding: 12px 18px;
      border-radius: 14px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
    }
    .meta-note {
      margin: 14px 0 0;
      font-size: 13px;
      line-height: 1.6;
      color: #5b7da6;
    }
    .footer {
      padding: 0 32px 30px;
    }
    .footer-card {
      background: #edf4fd;
      border: 1px solid #d7e3f4;
      border-radius: 18px;
      padding: 18px 20px;
      font-size: 13px;
      line-height: 1.6;
      color: #5b7da6;
    }
    .footer-card strong {
      color: #16355d;
    }
    .footer-card a {
      color: #2563eb;
      text-decoration: none;
    }
    @media only screen and (max-width: 640px) {
      .shell {
        padding: 12px;
      }
      .hero,
      .content,
      .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .hero {
        padding-top: 24px;
      }
      .hero h1 {
        font-size: 25px;
      }
      .card {
        padding: 16px;
        border-radius: 18px;
      }
      .detail-label,
      .detail-value {
        display: block;
        width: 100%;
        padding: 6px 0;
      }
      .detail-label {
        padding-bottom: 0;
      }
      .button {
        display: block;
        width: auto;
        text-align: center;
        margin-right: 0;
      }
    }
  </style>
</head>
<body>
  <div class="preheader">${escapeHtml(preheader)}</div>
  <div class="shell">
    <div class="frame">
      <div class="top-line"></div>
      ${content}
      <div class="footer">
        <div class="footer-card">
          <strong>NaufalRF</strong><br />
          Full-Stack Engineer<br />
          <a href="https://naufalrf.tech">naufalrf.tech</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
