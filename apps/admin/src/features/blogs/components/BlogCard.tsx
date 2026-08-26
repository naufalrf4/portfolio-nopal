import type { BlogLink } from '../types/blogs.types';
import { NEUMORPHIC_STYLES } from '../constants/blogs.constants';
import { formatDate } from '@/lib/utils/date';
import { truncateUrl } from '@/lib/utils/string';
import { Switch } from '@/components/ui/switch';
import { BlogLinkIcon, ExternalLinkIcon, EditIcon, TrashIcon } from './Icons';

interface BlogCardProps {
  blogLink: BlogLink;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export function BlogCard({ blogLink, onEdit, onDelete, onToggleVisibility }: BlogCardProps) {
  return (
    <div
      className="group rounded-[var(--radius-container)] p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: NEUMORPHIC_STYLES.background,
        boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--teal), var(--amber))',
            boxShadow: NEUMORPHIC_STYLES.shadows.small,
          }}
        >
          <span className="text-white">
            <BlogLinkIcon />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-display text-lg font-bold truncate"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            {blogLink.title}
          </h3>
          <a
            href={blogLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm hover:underline truncate mt-1"
            style={{ color: NEUMORPHIC_STYLES.accent }}
          >
            <span className="truncate">{truncateUrl(blogLink.url)}</span>
            <ExternalLinkIcon />
          </a>
          {blogLink.description && (
            <p className="text-sm mt-2 line-clamp-2" style={{ color: NEUMORPHIC_STYLES.muted }}>
              {blogLink.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: NEUMORPHIC_STYLES.background,
                boxShadow: NEUMORPHIC_STYLES.shadows.small,
                color: NEUMORPHIC_STYLES.accent,
              }}
            >
              {blogLink.source}
            </span>
            {blogLink.publishedAt && (
              <span className="text-xs" style={{ color: NEUMORPHIC_STYLES.muted }}>
                {formatDate(blogLink.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#D1D5DB]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={blogLink.visible}
            onCheckedChange={onToggleVisibility}
            aria-label={blogLink.visible ? 'Hide blog' : 'Show blog'}
          />
          <span
            className="text-sm font-medium"
            style={{
              color: blogLink.visible ? NEUMORPHIC_STYLES.success : NEUMORPHIC_STYLES.muted,
            }}
          >
            {blogLink.visible ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: NEUMORPHIC_STYLES.background,
              boxShadow: NEUMORPHIC_STYLES.shadows.small,
              color: NEUMORPHIC_STYLES.accent,
            }}
          >
            <EditIcon />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: NEUMORPHIC_STYLES.background,
              boxShadow: NEUMORPHIC_STYLES.shadows.small,
              color: '#EF4444',
            }}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
