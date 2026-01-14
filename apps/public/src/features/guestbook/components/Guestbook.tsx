'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import {
  Section,
  SectionHeader,
  NeuCard,
  NeuButton,
  ErrorState,
} from '@/src/features/shared/components';
import { GuestbookList } from './GuestbookList';
import { GuestbookModal } from './GuestbookModal';
import { api } from '@/src/lib/api';
import { getAuthErrorMessage } from '@/src/lib/auth/env-validation';
import { LogIn, MessageSquare, AlertCircle, Plus } from 'lucide-react';
import type { GuestbookEntry } from './types';

export function Guestbook() {
  const { data: session, status } = useSession();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authConfigError, setAuthConfigError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const errorMessage = getAuthErrorMessage();
    setAuthConfigError(errorMessage);
  }, []);

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.guestbook.getAll();
      const entries = response?.entries || [];
      setEntries(Array.isArray(entries) ? entries : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guestbook entries');
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
      <div className="animate-fade-in mx-auto max-w-7xl">
        <SectionHeader title="Guestbook" subtitle="Leave a message and say hello!" />

        <div className="max-w-3xl mx-auto space-y-8">
          <NeuCard className="stagger-item">
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
              <div className="text-center py-6">
                <NeuButton variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} className="mr-2" />
                  Leave a Message
                </NeuButton>
              </div>
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
          ) : error ? (
            <ErrorState
              title="Failed to load messages"
              message={error}
              onRetry={fetchEntries}
              showRetry={true}
            />
          ) : entries.length === 0 ? (
            <NeuCard className="text-center py-12 space-y-4">
              <MessageSquare className="w-16 h-16 mx-auto text-[#6B7280] opacity-50" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-[#3D4852]">No messages yet</p>
                <p className="text-[#6B7280]">Be the first to leave a message!</p>
              </div>
              {!isAuthenticated && (
                <NeuButton variant="accent" onClick={handleSignIn}>
                  <LogIn size={18} className="mr-2" />
                  Sign in to post
                </NeuButton>
              )}
            </NeuCard>
          ) : (
            <GuestbookList entries={entries} />
          )}
        </div>
      </div>

      {isAuthenticated && userEmail && (
        <GuestbookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userEmail={userEmail}
          onSuccess={handleSuccess}
        />
      )}
    </Section>
  );
}
