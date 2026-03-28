import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, LogIn, LogOut, MessageSquare, Plus, UserCircle2 } from 'lucide-react';
import { NeuCard } from '../shared/NeuCard';
import { NeuButton } from '../shared/NeuButton';
import { Section } from '../shared/Section';
import { SectionHeader } from '../shared/SectionHeader';
import { GuestbookModal } from './GuestbookModal';
import type { GuestbookEntry } from '@/types';
import { motion } from 'framer-motion';
import {
  clearStoredGuestbookUser,
  getStoredGuestbookUser,
  setStoredGuestbookUser,
  type StoredGuestbookUser,
} from '@/lib/guestbookIdentity';

interface GuestbookProps {
  initialEntries?: GuestbookEntry[];
  turnstileSiteKey: string;
  mode?: 'home' | 'page';
}

interface GuestbookResponse {
  success?: boolean;
  data?: {
    entries?: GuestbookEntry[];
  };
  entries?: GuestbookEntry[];
}

const SYNC_KEYS = [
  'guestbook_sync',
  'guestbook_email',
  'guestbook_name',
  'guestbook_image',
  'guestbook_token',
] as const;

export function Guestbook({
  initialEntries = [],
  turnstileSiteKey,
  mode = 'home',
}: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [user, setUser] = useState<StoredGuestbookUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const isSynced = currentUrl.searchParams.get('guestbook_sync') === '1';
    const syncedEmail = currentUrl.searchParams.get('guestbook_email');
    const syncedToken = currentUrl.searchParams.get('guestbook_token');

    if (isSynced && syncedEmail && syncedToken) {
      const syncedUser: StoredGuestbookUser = {
        id: syncedEmail,
        email: syncedEmail,
        name: currentUrl.searchParams.get('guestbook_name'),
        image: currentUrl.searchParams.get('guestbook_image'),
        token: syncedToken,
      };

      setStoredGuestbookUser(syncedUser);
      setUser(syncedUser);
      setIsModalOpen(true);

      const cleanedUrl = new URL(window.location.href);
      for (const key of SYNC_KEYS) {
        cleanedUrl.searchParams.delete(key);
      }
      window.history.replaceState({}, '', cleanedUrl.toString());
      return;
    }

    const stored = getStoredGuestbookUser();
    if (!stored) {
      return;
    }

    setUser(stored);
  }, []);

  const latestEntries = useMemo(() => entries.slice(0, 8), [entries]);
  const marqueeRows = useMemo(() => {
    const firstRow = latestEntries.slice(0, 4);
    const secondRowSource = latestEntries.slice(4, 8);
    const secondRow = secondRowSource.length > 0 ? secondRowSource : firstRow;
    return [firstRow, secondRow].filter((row) => row.length > 0);
  }, [latestEntries]);
  const isPageMode = mode === 'page';

  async function refreshEntries(): Promise<void> {
    const response = await fetch('/api/guestbook');
    if (!response.ok) {
      throw new Error('Failed to refresh guestbook entries.');
    }

    const payload = (await response.json()) as GuestbookResponse;
    setEntries(payload.data?.entries ?? payload.entries ?? []);
  }

  async function handleSuccess(): Promise<void> {
    setError(null);
    setSuccess('Your message has been added to the guestbook.');
    await refreshEntries();
  }

  function handleSignOut(): void {
    clearStoredGuestbookUser();
    setUser(null);
    setIsModalOpen(false);
    setSuccess(null);
  }

  return (
    <Section id="guestbook">
      <style>{`
        @keyframes guestbook-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .guestbook-marquee-track {
          animation: guestbook-marquee 34s linear infinite;
          will-change: transform;
        }

        .guestbook-marquee-track-reverse {
          animation-direction: reverse;
          animation-duration: 40s;
        }

        .guestbook-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <SectionHeader
        title="Guestbook"
        subtitle={
          isPageMode
            ? 'Read full notes from visitors, collaborators, and friends, or leave your own once you sign in with Google.'
            : 'A few words from people who stopped by. Leave a short message once you sign in with Google.'
        }
      />

      <motion.div
        className="mx-auto max-w-4xl space-y-6"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <NeuCard className="p-5 text-center md:p-6 homepage-card-hover">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#E0E5EC] text-[#3B82F6] shadow-[8px_8px_16px_rgba(163,177,198,0.55),-8px_-8px_16px_rgba(255,255,255,0.7)]">
            <MessageSquare size={24} />
          </div>

          <h3 className="text-xl font-bold text-[#3D4852] md:text-2xl">Leave a message</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#6B7280]">
            A few words from visitors, collaborators, and friends. Leave a short public note once
            you sign in with Google.
          </p>

          {user ? (
            <div className="mt-6 space-y-5">
              <motion.div
                className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl bg-[#E0E5EC]/75 p-4 text-left shadow-[inset_4px_4px_8px_rgba(163,177,198,0.45),inset_-4px_-4px_8px_rgba(255,255,255,0.55)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.64, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                    <UserCircle2 size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3D4852]">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-[#6B7280]">{user.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#6B7280] transition-all duration-300 hover:text-[#3B82F6] hover:-translate-y-0.5"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.62, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                <NeuButton
                  variant="primary"
                  size="md"
                  onClick={() => setIsModalOpen(true)}
                  data-analytics-button
                  data-entity-type="guestbook_open_compose"
                  data-entity-id="guestbook"
                  data-entity-label="Leave a guestbook message"
                >
                  <Plus size={18} className="mr-2" />
                  Leave a message
                </NeuButton>
              </motion.div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-[#6B7280]">
                Sign in with Google before posting to the guestbook.
              </p>
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.62, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <NeuButton
                  variant="accent"
                  size="md"
                  onClick={() => setIsModalOpen(true)}
                  data-analytics-button
                  data-entity-type="guestbook_signin_cta"
                  data-entity-id="guestbook"
                  data-entity-label="Sign in to guestbook"
                >
                  <LogIn size={18} className="mr-2" />
                  Sign in to guestbook
                </NeuButton>
              </motion.div>
            </div>
          )}

          {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}

          {!isPageMode ? (
            <div className="mt-5 flex justify-center">
              <a
                href="/guestbook"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-transparent px-6 py-3 text-base font-medium text-[#3D4852] transition-all duration-200 hover:bg-[#E0E5EC]/50 hover:text-[#3B82F6] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]"
              >
                Read full guestbook
                <ArrowRight size={16} />
              </a>
            </div>
          ) : null}
        </NeuCard>

        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <NeuCard className="p-8 text-center">
              <p className="text-base font-medium text-[#3D4852]">
                Failed to load guestbook entries.
              </p>
              <p className="mt-2 text-sm text-red-500">{error}</p>
            </NeuCard>
          </motion.div>
        ) : latestEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <NeuCard className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#E0E5EC]/80 text-[#6B7280] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.45),inset_-4px_-4px_8px_rgba(255,255,255,0.55)]">
                <MessageSquare size={28} />
              </div>
              <p className="mt-5 text-lg font-medium text-[#3D4852]">No messages yet</p>
              <p className="mt-2 text-sm text-[#6B7280]">Be the first to leave a short message.</p>
            </NeuCard>
          </motion.div>
        ) : isPageMode ? (
          <div className="grid gap-4 md:grid-cols-2">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.56,
                  delay: index * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <NeuCard className="h-full p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                      {entry.user.image ? (
                        <img
                          src={entry.user.image}
                          alt={entry.user.name || 'Guestbook visitor'}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <UserCircle2 size={20} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#3D4852]">
                        {entry.user.name || 'Anonymous visitor'}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#556476]">
                        {entry.message}
                      </p>
                    </div>
                  </div>
                </NeuCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 overflow-hidden">
            {marqueeRows.map((row, rowIndex) => (
              <motion.div
                key={`guestbook-row-${rowIndex}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.62,
                  delay: 0.08 + rowIndex * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden rounded-[24px]"
              >
                <div
                  className={
                    rowIndex % 2 === 1
                      ? 'guestbook-marquee-track guestbook-marquee-track-reverse flex w-max gap-3'
                      : 'guestbook-marquee-track flex w-max gap-3'
                  }
                >
                  {[...row, ...row, ...row].map((entry, index) => (
                    <div
                      key={`${entry.id}-${rowIndex}-${index}`}
                      className="flex w-[280px] flex-shrink-0 items-center gap-3 rounded-[22px] bg-[linear-gradient(145deg,rgba(248,250,252,0.98),rgba(240,244,249,0.96))] px-4 py-3 shadow-[8px_8px_18px_rgba(183,194,208,0.18),-8px_-8px_18px_rgba(255,255,255,0.72)]"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                        {entry.user.image ? (
                          <img
                            src={entry.user.image}
                            alt={entry.user.name || 'Guestbook visitor'}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <UserCircle2 size={18} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <p className="truncate text-sm font-semibold text-[#3D4852]">
                            {entry.user.name || 'Anonymous visitor'}
                          </p>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#556476]">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <GuestbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSuccess={handleSuccess}
        turnstileSiteKey={turnstileSiteKey}
      />
    </Section>
  );
}
