import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('[Email] RESEND_API_KEY not configured - email sending will be disabled');
}

export const resend = new Resend(process.env.RESEND_API_KEY || '');

export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'NaufalRF <noreply@naufalrf.tech>',
  replyTo: process.env.EMAIL_REPLY_TO,
  adminDashboardUrl: process.env.NEXTAUTH_URL || 'http://localhost:3001',
  publicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
