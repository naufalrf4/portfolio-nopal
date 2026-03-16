'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExperienceItem } from '../types/about.types';

interface ExperienceCardProps {
  experience: ExperienceItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExperienceCard({ experience, onEdit, onDelete }: ExperienceCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.4)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 flex-1 min-w-0">
          {experience.logoUrl ? (
            <img
              src={experience.logoUrl}
              alt={`${experience.organization} logo`}
              className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.4)]"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center shrink-0 shadow-[3px_3px_6px_rgba(163,177,198,0.5),-3px_-3px_6px_rgba(255,255,255,0.4)]">
              <span className="text-white font-bold text-lg">
                {experience.organization.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[#3D4852]">{experience.title}</h4>
            <p className="text-sm text-[#6B7280]">
              {experience.organization}
              {experience.location && ` • ${experience.location}`}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              {experience.startDate} - {experience.endDate || 'Present'}
            </p>
            {experience.description && (
              <p className="text-sm text-[#3D4852] mt-2 line-clamp-2">{experience.description}</p>
            )}
            {experience.skills && experience.skills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-[#E0E5EC] px-2.5 py-1 text-xs text-[#3D4852] shadow-[2px_2px_4px_rgba(163,177,198,0.5),-2px_-2px_4px_rgba(255,255,255,0.35)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="icon-sm" variant="ghost" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
