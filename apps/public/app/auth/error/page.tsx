import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthErrorContent } from './AuthErrorContent';

export const metadata: Metadata = {
  title: 'Authentication Error',
  description: 'An error occurred during authentication',
};

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <AuthErrorContent />
    </Suspense>
  );
}
