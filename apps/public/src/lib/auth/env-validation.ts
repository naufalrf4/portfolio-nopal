export function validateAuthEnvironment(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is not configured. Generate one with: openssl rand -base64 32');
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    errors.push('GOOGLE_CLIENT_ID is not configured');
  }

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    errors.push('GOOGLE_CLIENT_SECRET is not configured');
  }

  if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    errors.push('NEXTAUTH_URL must be set in production');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getAuthErrorMessage(): string | null {
  const validation = validateAuthEnvironment();

  if (!validation.isValid) {
    return `Authentication configuration error:\n${validation.errors.join('\n')}`;
  }

  return null;
}
