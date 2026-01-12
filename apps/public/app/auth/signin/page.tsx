import type { Metadata } from 'next';
import { SignInContent } from './SignInContent';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to leave a message in the guestbook',
};

export default function SignInPage() {
  return <SignInContent />;
}
