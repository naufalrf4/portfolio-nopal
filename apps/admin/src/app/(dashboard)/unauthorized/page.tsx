import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UnauthorizedPageContent } from './UnauthorizedPageContent';

export const metadata: Metadata = {
  title: 'Access Denied',
  description: 'You do not have permission to access this application',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UnauthorizedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return <UnauthorizedPageContent userEmail={session.user.email || 'Unknown'} />;
}
