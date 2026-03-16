import type { Metadata } from 'next';
import { safeAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SettingsPageContent } from './SettingsPageContent';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account and application preferences',
};

export default async function SettingsPage() {
  const session = await safeAuth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <PageWrapper>
      <PageHeader title="Settings" description="Manage your account and application preferences" />
      <SettingsPageContent session={session} />
    </PageWrapper>
  );
}
