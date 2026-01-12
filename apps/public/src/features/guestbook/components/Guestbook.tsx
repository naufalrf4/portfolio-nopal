'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Section, SectionHeader, NeuCard, NeuButton } from '@/src/features/shared/components';
import { GuestbookList } from './GuestbookList';
import { GuestbookForm } from './GuestbookForm';
import { api } from '@/src/lib/api';
import { getAuthErrorMessage } from '@/src/lib/auth/env-validation';
import { LogIn, MessageSquare, AlertCircle } from 'lucide-react';
import type { GuestbookEntry } from './types';

export function Guestbook() {
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authConfigError, setAuthConfigError] = useState<string | null>(null);

  useEffect(() => {
    const errorMessage = getAuthErrorMessage();
    setAuthConfigError(errorMessage);
  }, []);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await api.guestbook.getAll();
      const entries = response?.entries || [];
      setEntries(Array.isArray(entries) ? entries : []);
    } catch (error) {
      console.error('Failed to fetch guestbook entries:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSuccess = () => {
    fetchEntries();
  };

  const handleSignIn = () => {
    if (authConfigError) {
      alert('Authentication is not properly configured. Please contact the site administrator.');
      return;
    }
    signIn('google');
  };

  const isAuthenticated = status === 'authenticated' && session?.user;
  const isAuthLoading = status === 'loading';
  const userEmail = session?.user?.email;

  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Guestbook" subtitle="Leave a message and say hello!" />

        <div className="max-w-3xl mx-auto space-y-8">
          <NeuCard>
            {authConfigError ? (
              <div className="text-center py-6 space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
                <div className="space-y-2">
                  <p className="text-red-600 font-medium">Authentication Configuration Error</p>
                  <p className="text-sm text-[#6B7280]">
                    The guestbook requires authentication to be properly configured.
                  </p>
                  <p className="text-xs text-[#6B7280] font-mono bg-gray-50 p-2 rounded">
                    {authConfigError}
                  </p>
                </div>
              </div>
            ) : isAuthLoading ? (
              <div className="text-center py-6">
                <div className="animate-pulse text-[#6B7280]">Loading...</div>
              </div>
            ) : isAuthenticated && userEmail ? (
              <GuestbookForm userEmail={userEmail} onSuccess={handleSuccess} />
            ) : (
              <div className="text-center py-6 space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto text-[#6B7280]" />
                <p className="text-[#6B7280]">Sign in to leave a message</p>
                <NeuButton variant="accent" onClick={handleSignIn}>
                  <LogIn size={18} className="mr-2" />
                  Sign in with Google
                </NeuButton>
              </div>
            )}
          </NeuCard>

          {isLoading ? (
            <NeuCard className="text-center py-8">
              <div className="animate-pulse text-[#6B7280]">Loading messages...</div>
            </NeuCard>
          ) : (
            <GuestbookList entries={entries} />
          )}
        </div>
      </div>
    </Section>
  );
}
