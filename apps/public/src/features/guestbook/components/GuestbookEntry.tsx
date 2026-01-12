import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import { NeuCard } from '@/src/features/shared/components';
import { formatRelativeDate } from '@/src/lib/utils';
import type { GuestbookEntry as GuestbookEntryType } from './types';

interface GuestbookEntryProps {
  entry: GuestbookEntryType;
}

export function GuestbookEntry({ entry }: GuestbookEntryProps) {
  return (
    <NeuCard className="p-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)] flex-shrink-0">
          {entry.user?.image ? (
            <Image
              src={entry.user.image}
              alt={entry.user?.name || 'User'}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-white font-medium">{entry.user?.name?.charAt(0) || '?'}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[#3D4852]">{entry.user?.name || 'Anonymous'}</span>
            <span className="text-sm text-[#6B7280]">{formatRelativeDate(entry.createdAt)}</span>
          </div>
          <p className="text-[#6B7280]">{entry.message}</p>
        </div>
      </div>
    </NeuCard>
  );
}
