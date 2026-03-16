import type { NextRequest } from 'next/server';
import { getIpLocation } from '@/lib/services/geoIpService';
import { hashIp } from '@/lib/utils/hash';

export interface SubmissionMetadata {
  sourceApp: string | null;
  sourcePath: string | null;
  userAgent: string | null;
  language: string | null;
  referrer: string | null;
  referrerDomain: string | null;
  timezone: string | null;
}

export interface SubmissionContext {
  ipHash: string;
  ipAddress: string | null;
  countryCode: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  metadata: SubmissionMetadata;
}

function normalizeHeaderValue(value: string | null, maxLength: number): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function getClientIp(request: NextRequest): string {
  const candidates = [
    request.headers.get('x-real-ip'),
    request.headers.get('x-vercel-forwarded-for'),
    request.headers.get('x-forwarded-for'),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const firstIp = candidate
      .split(',')
      .map((segment) => segment.trim())
      .find(Boolean);

    if (firstIp) {
      return firstIp;
    }
  }

  return 'unknown';
}

function getReferrerDomain(referrer: string | null): string | null {
  if (!referrer) {
    return null;
  }

  try {
    return new URL(referrer).hostname || null;
  } catch {
    return null;
  }
}

function getLanguage(request: NextRequest): string | null {
  const rawLanguage = normalizeHeaderValue(request.headers.get('accept-language'), 64);
  if (!rawLanguage) {
    return null;
  }

  const firstLanguage = rawLanguage.split(',')[0]?.trim();
  return firstLanguage ? firstLanguage.slice(0, 16) : null;
}

export function getSubmissionContext(request: NextRequest): SubmissionContext {
  const clientIp = getClientIp(request);
  const geoLocation = clientIp === 'unknown' ? null : getIpLocation(clientIp);
  const referrer = normalizeHeaderValue(request.headers.get('referer'), 512);

  return {
    ipHash: hashIp(clientIp),
    ipAddress: clientIp === 'unknown' ? null : clientIp,
    countryCode: geoLocation?.countryCode ?? null,
    country: geoLocation?.country ?? null,
    city: geoLocation?.city ?? null,
    region: geoLocation?.region ?? null,
    metadata: {
      sourceApp: normalizeHeaderValue(request.headers.get('x-portfolio-source-app'), 64),
      sourcePath: normalizeHeaderValue(request.headers.get('x-portfolio-source-path'), 255),
      userAgent: normalizeHeaderValue(request.headers.get('user-agent'), 512),
      language: getLanguage(request),
      referrer,
      referrerDomain: getReferrerDomain(referrer),
      timezone: normalizeHeaderValue(request.headers.get('x-portfolio-timezone'), 100),
    },
  };
}
