import { NeuCard } from '@/src/features/shared/components';
import { GuestbookEntry } from './GuestbookEntry';
import type { GuestbookEntry as GuestbookEntryType } from './types';

interface GuestbookListProps {
  entries: GuestbookEntryType[];
}

export function GuestbookList({ entries }: GuestbookListProps) {
  if (entries.length === 0) {
    return (
      <NeuCard className="text-center py-8">
        <p className="text-[#6B7280]">No messages yet. Be the first to leave one!</p>
      </NeuCard>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <GuestbookEntry key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
