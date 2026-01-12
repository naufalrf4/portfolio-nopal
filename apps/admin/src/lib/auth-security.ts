const ALLOWED_EMAILS = ['naufalrf32@gmail.com', 'naufalrf4@gmail.com'];

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}
