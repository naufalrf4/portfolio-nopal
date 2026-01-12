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

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

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
