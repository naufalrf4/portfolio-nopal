import { cn } from '@/lib/utils';
import { ExternalLink, FileText } from 'lucide-react';
import type { Citation } from './types';

interface SourcesListProps {
  citations?: Citation[];
}

export function SourcesList({ citations }: SourcesListProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-line">
      <p className="font-mono text-xs font-medium text-text-tertiary mb-2">Grounded in</p>
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
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs',
                'border border-teal/30 bg-[var(--teal-soft)]',
                'text-teal',
                'transition-all hover:-translate-y-0.5 hover:border-teal/50'
              )}
            >
              <ExternalLink size={12} className="shrink-0" />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{citation.routeLabel || label}</span>
                {sublabel ? (
                  <span className="truncate text-[11px] text-text-tertiary">{sublabel}</span>
                ) : null}
              </span>
            </a>
          ) : (
            <div
              key={`${citation.source}-${index}`}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
                'border border-line bg-bg-elevated',
                'text-text-secondary'
              )}
            >
              <FileText size={12} className="shrink-0 text-text-tertiary" />
              <span className="truncate font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
