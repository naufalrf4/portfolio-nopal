import { redirect } from 'next/navigation';
import { safeAuth } from '@/lib/auth';
import { SignInForm } from './sign-in-form';

interface SignInPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await safeAuth();
  const params = await searchParams;
  const errorMessage =
    params.error === 'access_denied'
      ? 'Access denied. Admin privileges required.'
      : params.error === 'unauthorized'
        ? 'You do not have admin privileges.'
        : params.error === 'OAuthAccountNotLinked'
          ? 'Email already used with different provider.'
          : params.error === 'Configuration'
            ? 'Google sign-in could not be completed for this request. If you opened the admin from another host alias, retry from localhost:3001.'
            : params.error === 'MissingCSRF'
              ? 'Your sign-in session expired. Please try again.'
              : params.error
                ? 'Authentication error occurred.'
                : null;

  if (session?.user) {
    if (session.user.role === 'ADMIN') {
      redirect(params.callbackUrl || '/dashboard');
    }

    redirect('/unauthorized');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="neu-card p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your admin account to continue
            </p>
          </div>

          {errorMessage && (
            <div className="neu-shadow-inset bg-destructive/10 text-destructive rounded-xl p-4 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <SignInForm callbackUrl={params.callbackUrl} />
        </div>
      </div>
    </div>
  );
}
