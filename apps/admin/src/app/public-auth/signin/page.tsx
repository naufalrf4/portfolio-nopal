import { redirect } from 'next/navigation';
import { safeAuth } from '@/lib/auth';
import { SignInForm } from '@/app/auth/signin/sign-in-form';

interface PublicGuestbookSignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function PublicGuestbookSignInPage({
  searchParams,
}: PublicGuestbookSignInPageProps) {
  const session = await safeAuth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl || '/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="neu-card p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold text-foreground">
              Guestbook Sign In
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with Google to continue to the guestbook.
            </p>
          </div>

          <SignInForm callbackUrl={params.callbackUrl} />
        </div>
      </div>
    </div>
  );
}
