import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProfileLink } from '../types/links.types';
import { getIconData } from '../utils/links.utils';

interface LinkCardProps {
  link: ProfileLink;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}

export function LinkCard({ link, index, onEdit, onDelete, onToggleVisibility }: LinkCardProps) {
  const { icon: IconComponent, color } = getIconData(link.icon);

  return (
    <div
      className="group relative rounded-[32px] bg-[#E0E5EC] p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
            boxShadow: '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
          }}
        >
          <IconComponent className="h-7 w-7 text-white" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onEdit}
                className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] transition-all duration-200 hover:shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-red-500 transition-all duration-200 hover:shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <h3 className="font-display text-lg font-bold text-[#3D4852] mb-1">{link.label}</h3>

      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#6B7280] hover:text-[#3B82F6] flex items-center gap-1 mb-4 truncate"
      >
        <span className="truncate">{link.url}</span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>

      <div className="flex items-center justify-between pt-4 border-t border-[#6B7280]/10">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleVisibility}
                className={`p-1.5 rounded-lg transition-colors ${
                  link.visible ? 'text-[#38B2AC]' : 'text-[#6B7280]/40 hover:text-[#38B2AC]'
                }`}
              >
                {link.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>{link.visible ? 'Hide link' : 'Show link'}</TooltipContent>
          </Tooltip>
        </div>
        <Badge variant="outline" className="capitalize text-xs">
          {link.icon || 'custom'}
        </Badge>
      </div>
    </div>
  );
}
