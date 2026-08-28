import { timingSafeEqual } from 'node:crypto';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
  timestamp?: string;
  hostname?: string;
}

interface TurnstileValidationResult {
  success: boolean;
  status?: number;
  code?: string;
  message?: string;
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const RAG_SERVICE_TOKEN_HEADER = 'X-Service-Token';

const RAG_SERVICE_TOKEN = process.env.RAG_SERVICE_TOKEN;

export function isRagServiceTokenValid(provided: string | null): boolean {
  if (!provided || !RAG_SERVICE_TOKEN) {
    return false;
  }

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(RAG_SERVICE_TOKEN);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function verifyTurnstileToken(token: string): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('TURNSTILE_SECRET_KEY environment variable is not configured');
  }

  if (!token || typeof token !== 'string' || token.trim() === '') {
    return {
      success: false,
      errorCodes: ['missing-input-response'],
    };
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
    }),
  });

  if (!response.ok) {
    return {
      success: false,
      errorCodes: ['turnstile-service-error'],
    };
  }

  const data: TurnstileVerifyResponse = await response.json();

  return {
    success: data.success,
    errorCodes: data['error-codes'],
    timestamp: data.challenge_ts,
    hostname: data.hostname,
  };
}

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function validateTurnstileToken(token?: string): Promise<TurnstileValidationResult> {
  const turnstileConfigured = isTurnstileConfigured();
  const shouldEnforce = process.env.NODE_ENV === 'production' || turnstileConfigured;

  if (!shouldEnforce) {
    return { success: true };
  }

  if (!turnstileConfigured) {
    return {
      success: false,
      status: 503,
      code: 'TURNSTILE_NOT_CONFIGURED',
      message: 'CAPTCHA verification is temporarily unavailable.',
    };
  }

  if (!token || token.trim() === '') {
    return {
      success: false,
      status: 400,
      code: 'TURNSTILE_TOKEN_REQUIRED',
      message: 'CAPTCHA verification is required.',
    };
  }

  const result = await verifyTurnstileToken(token);

  if (!result.success) {
    return {
      success: false,
      status: 400,
      code: 'TURNSTILE_VERIFICATION_FAILED',
      message: 'CAPTCHA verification failed. Please try again.',
    };
  }

  return { success: true };
}
