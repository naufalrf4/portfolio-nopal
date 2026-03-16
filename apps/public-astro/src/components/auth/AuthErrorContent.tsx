import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { NeuButton } from '../shared/NeuButton';
import { NeuCard } from '../shared/NeuCard';

interface AuthErrorContentProps {
  message?: string;
}

export function AuthErrorContent({ message }: AuthErrorContentProps) {
  return (
    <NeuCard className="mx-auto max-w-2xl p-8 md:p-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-[6px_6px_12px_rgba(163,177,198,0.4),-6px_-6px_12px_rgba(255,255,255,0.5)]">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-[#3D4852]">Guestbook sign-in failed</h2>
      <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
        {message ||
          'We could not complete the guestbook sign-in flow. Please try again from the guestbook section.'}
      </p>
      <div className="mt-8 flex justify-center">
        <a href="/auth/signin?callbackUrl=/">
          <NeuButton variant="primary" size="md">
            <ArrowLeft size={18} className="mr-2" />
            Back to sign in
          </NeuButton>
        </a>
      </div>
    </NeuCard>
  );
}
