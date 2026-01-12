'use client';

import { useSearchParams } from 'next/navigation';
import { NeuCard, NeuButton } from '@/src/features/shared/components';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration. Please contact support.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification: 'The verification link has expired or has already been used.',
  OAuthSignin: 'Error in constructing an authorization URL.',
  OAuthCallback: 'Error in handling the response from the OAuth provider.',
  OAuthCreateAccount: 'Could not create OAuth provider user in the database.',
  EmailCreateAccount: 'Could not create email provider user in the database.',
  Callback: 'Error in the OAuth callback handler route.',
  OAuthAccountNotLinked:
    'The email on the account is already linked, but not with this OAuth account.',
  EmailSignin: 'Sending the email with the verification token failed.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An error occurred during authentication. Please try again.',
};

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorMessage = errorMessages[error] || errorMessages.Default;

  const handleRetry = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#1E293B]">Authentication Error</h1>
          <p className="text-[#6B7280]">Something went wrong during sign in</p>
        </div>

        <NeuCard className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              <div className="space-y-2">
                <p className="font-medium text-[#1E293B]">{error}</p>
                <p className="text-sm text-[#6B7280]">{errorMessage}</p>
              </div>
            </div>

            <div className="space-y-3">
              <NeuButton variant="accent" onClick={handleRetry} className="w-full">
                <RefreshCw size={18} className="mr-2" />
                Try Again
              </NeuButton>

              <Link href="/" className="block">
                <NeuButton variant="default" className="w-full">
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Home
                </NeuButton>
              </Link>
            </div>
          </div>
        </NeuCard>
      </div>
    </div>
  );
}
