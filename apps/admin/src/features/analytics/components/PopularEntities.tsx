'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FolderOpen, FileText, Link2, TrendingUp, type LucideIcon } from 'lucide-react';

interface PopularEntitiesProps {
  data?: {
    projects: Array<{ id: string; title: string; views: number }>;
    blogs: Array<{ id: string; title: string; views: number }>;
    links: Array<{ id: string; label: string; clicks: number }>;
  };
  loading?: boolean;
}

interface Entity {
  id: string;
  type: 'project' | 'blog' | 'link';
  icon: LucideIcon;
  title: string;
  views: number;
}

function getEntityValue(entity: Entity): number {
  return entity.views;
}

export function PopularEntities({ data, loading }: PopularEntitiesProps) {
  if (loading) {
    return (
      <Card
        className={cn(
          'p-6 bg-[#E0E5EC]',
          'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#3D4852]">Popular Entities</h3>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-[#D1D5DB]/30 rounded-xl animate-pulse"
              >
                <div className="w-10 h-10 bg-[#D1D5DB]/50 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-[#D1D5DB]/50 rounded" />
                  <div className="h-2 w-20 bg-[#D1D5DB]/50 rounded" />
                </div>
                <div className="w-16 h-6 bg-[#D1D5DB]/50 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const entitiesData = data || { projects: [], blogs: [], links: [] };

  const projects: Entity[] = entitiesData.projects.map((p) => ({
    ...p,
    type: 'project',
    icon: FolderOpen,
    views: p.views,
  }));

  const blogs: Entity[] = entitiesData.blogs.map((b) => ({
    ...b,
    type: 'blog',
    icon: FileText,
    views: b.views,
  }));

  const links: Entity[] = entitiesData.links.map((l) => ({
    ...l,
    type: 'link',
    icon: Link2,
    title: l.label,
    views: l.clicks,
  }));

  const allEntities: Entity[] = [...projects, ...blogs, ...links]
    .sort((a, b) => getEntityValue(b) - getEntityValue(a))
    .slice(0, 5);

  return (
    <Card
      className={cn(
        'p-6 bg-[#E0E5EC]',
        'shadow-[9px_9px_16px_rgba(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)]'
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#3D4852]">Popular Entities</h3>
        <TrendingUp className="w-5 h-5 text-[#6B7280]" />
      </div>

      {allEntities.length > 0 ? (
        <div className="space-y-3">
          {allEntities.map((entity) => {
            const Icon = entity.icon;

            return (
              <div
                key={entity.id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-all duration-300',
                  'hover:shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]',
                  'hover:-translate-y-0.5',
                  'bg-[#E0E5EC]'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]',
                    'bg-gradient-to-br',
                    entity.type === 'project'
                      ? 'from-blue-400/20 to-cyan-500/20 text-blue-500'
                      : entity.type === 'blog'
                        ? 'from-purple-400/20 to-pink-500/20 text-purple-500'
                        : 'from-emerald-400/20 to-teal-500/20 text-emerald-500'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#3D4852] truncate">{entity.title}</p>
                  <p className="text-xs text-[#6B7280] capitalize">{entity.type}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-[#3D4852]">{entity.views.toLocaleString()}</p>
                  <p className="text-xs text-[#6B7280]">
                    {entity.type === 'link' ? 'clicks' : 'views'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center">
          <TrendingUp className="w-12 h-12 text-[#D1D5DB] mb-3" />
          <p className="text-[#6B7280] text-sm">No data available</p>
        </div>
      )}
    </Card>
  );
}
