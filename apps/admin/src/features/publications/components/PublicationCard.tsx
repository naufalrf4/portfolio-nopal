import type { PublicationLink } from '../types/publications.types';
import { SURFACE_STYLES } from '../constants/publications.constants';
import { formatDate } from '@/lib/utils/date';
import { truncateUrl } from '@/lib/utils/string';
import { Switch } from '@/components/ui/switch';
import { PublicationLinkIcon, ExternalLinkIcon, EditIcon, TrashIcon } from './Icons';

interface PublicationCardProps {
  publicationLink: PublicationLink;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export function PublicationCard({ publicationLink, onEdit, onDelete, onToggleVisibility }: PublicationCardProps) {
  return (
    <div
      className="group rounded-[var(--radius-container)] p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: SURFACE_STYLES.background,
        boxShadow: SURFACE_STYLES.shadows.extruded,
      }}
    >
      {publicationLink.imageUrl && (
        <div className="mb-4 rounded-2xl overflow-hidden bg-[var(--bg-elevated)] shadow-surface-sunken-sm">
          <img src={publicationLink.imageUrl} alt={publicationLink.title} className="w-full h-40 object-cover" />
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-line-strong bg-accent text-accent-foreground">
          <PublicationLinkIcon />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-display text-lg font-bold truncate"
            style={{ color: SURFACE_STYLES.foreground }}
          >
            {publicationLink.title}
          </h3>
          <a
            href={publicationLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:underline truncate mt-1"
            style={{ color: SURFACE_STYLES.accent }}
          >
            <span className="truncate">{truncateUrl(publicationLink.url)}</span>
            <ExternalLinkIcon />
          </a>
          {publicationLink.description && (
            <p className="text-sm mt-2 line-clamp-2" style={{ color: SURFACE_STYLES.muted }}>
              {publicationLink.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: SURFACE_STYLES.background,
                boxShadow: SURFACE_STYLES.shadows.small,
                color: SURFACE_STYLES.accent,
              }}
            >
              {publicationLink.source}
            </span>
            {publicationLink.publishedAt && (
              <span className="text-xs" style={{ color: SURFACE_STYLES.muted }}>
                {formatDate(publicationLink.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={publicationLink.visible}
            onCheckedChange={onToggleVisibility}
            aria-label={publicationLink.visible ? 'Hide publication' : 'Show publication'}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: publicationLink.visible ? SURFACE_STYLES.success : SURFACE_STYLES.muted,
            }}
          >
            {publicationLink.visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: SURFACE_STYLES.background,
              boxShadow: SURFACE_STYLES.shadows.small,
              color: SURFACE_STYLES.accent,
            }}
          >
            <EditIcon />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110 border border-line-strong text-destructive"
            style={{
              backgroundColor: SURFACE_STYLES.background,
              boxShadow: SURFACE_STYLES.shadows.small,
            }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
