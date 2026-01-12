'use client';

import { useState, useEffect, useCallback } from 'react';
import { Section, SectionHeader, NeuCard } from '@/src/features/shared/components';
import { GuestbookList } from './GuestbookList';
import { GuestbookForm } from './GuestbookForm';
import { api } from '@/src/lib/api';
import type { GuestbookEntry } from './types';

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Section>
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Guestbook" subtitle="Leave a message and say hello!" />

        <div className="max-w-3xl mx-auto space-y-8">
          <NeuCard>
            <GuestbookForm onSuccess={handleSuccess} />
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
