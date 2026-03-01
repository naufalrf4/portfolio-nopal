import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface SourcesListProps {
  sources: string[];
}

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-[#D1D5DB]">
      <p className="text-xs font-medium text-[#6B7280] mb-2">Sources:</p>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 text-xs',
              'bg-[#F3F4F6] rounded-md text-[#3B82F6]',
              'hover:bg-[#E5E7EB] transition-colors'
            )}
          >
            <ExternalLink size={10} />
            <span className="truncate max-w-32">
              {new URL(source).hostname.replace('www.', '')}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
