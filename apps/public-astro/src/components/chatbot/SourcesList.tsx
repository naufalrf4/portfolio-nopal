import { cn } from '@/lib/utils';
import { ExternalLink, FileText } from 'lucide-react';
import type { Citation } from './types';

interface SourcesListProps {
  citations?: Citation[];
}

export function SourcesList({ citations }: SourcesListProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-[#D1D5DB]">
      <p className="text-xs font-medium text-[#6B7280] mb-2">Grounded in</p>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation, index) => {
          const label = citation.title || citation.section || citation.source;
          const sublabel =
            citation.section && citation.section !== citation.title ? citation.section : null;

          return citation.route ? (
            <a
              key={`${citation.source}-${index}`}
              href={citation.route}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs',
                'bg-[linear-gradient(145deg,rgba(240,244,248,0.98),rgba(228,235,244,0.95))]',
                'text-[#2563EB] shadow-[4px_4px_10px_rgba(163,177,198,0.2),-4px_-4px_10px_rgba(255,255,255,0.3)]',
                'transition-all hover:-translate-y-0.5 hover:text-[#1D4ED8]'
              )}
            >
              <ExternalLink size={12} className="shrink-0" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{citation.routeLabel || label}</span>
                {sublabel ? (
                  <span className="truncate text-[11px] text-[#6B7280]">{sublabel}</span>
                ) : null}
              </span>
            </a>
          ) : (
            <div
              key={`${citation.source}-${index}`}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs',
                'bg-[linear-gradient(145deg,rgba(240,244,248,0.98),rgba(228,235,244,0.95))]',
                'text-[#4B5563] shadow-[4px_4px_10px_rgba(163,177,198,0.2),-4px_-4px_10px_rgba(255,255,255,0.3)]'
              )}
            >
              <FileText size={12} className="shrink-0 text-[#6B7280]" />
              <span className="truncate font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
