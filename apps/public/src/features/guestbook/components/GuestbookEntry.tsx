import Image from 'next/image';
import { NeuCard } from '@/src/features/shared/components';
import type { GuestbookEntry as GuestbookEntryType } from './types';

interface GuestbookEntryProps {
  entry: GuestbookEntryType;
}

export function GuestbookEntry({ entry }: GuestbookEntryProps) {
  return (
    <NeuCard className="p-3 min-h-[100px] max-h-[140px] w-[260px] flex flex-col">
      <div className="flex items-center gap-2.5 mb-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-[2px_2px_4px_rgba(163,177,198,0.6),-2px_-2px_4px_rgba(255,255,255,0.5)] flex-shrink-0">
          {entry.user?.image ? (
            <Image
              src={entry.user.image}
              alt={entry.user?.name || 'User'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {entry.user?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-[#3D4852] text-sm truncate">
            {entry.user?.name || 'Anonymous'}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#6B7280] line-clamp-3 flex-1 leading-relaxed">{entry.message}</p>
    </NeuCard>
  );
}
