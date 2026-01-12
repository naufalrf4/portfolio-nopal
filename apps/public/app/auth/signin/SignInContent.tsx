'use client';

import { signIn } from 'next-auth/react';
import { NeuCard, NeuButton } from '@/src/features/shared/components';
import { LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function SignInContent() {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#1E293B]">Sign In</h1>
          <p className="text-[#6B7280]">Sign in with your Google account to continue</p>
        </div>

        <NeuCard className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <LogIn className="w-16 h-16 mx-auto text-[#6B7280]" />
              <p className="text-sm text-[#6B7280]">
                You need to sign in to leave messages in the guestbook
              </p>
            </div>

            <NeuButton variant="accent" onClick={handleSignIn} className="w-full">
              <LogIn size={18} className="mr-2" />
              Sign in with Google
            </NeuButton>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </NeuCard>
      </div>
    </div>
  );
}
