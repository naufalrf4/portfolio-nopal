'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { formatExperienceDate } from '@/src/lib/utils';
import { NeuCard } from '@/src/features/shared/components';
import { Calendar, MapPin, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import type { Experience } from './types';

interface ExperienceTabsProps {
  experience: Experience[];
}

const tabConfig = [
  { type: 'work', label: 'Experience', icon: Briefcase },
  { type: 'education', label: 'Education', icon: GraduationCap },
  { type: 'certification', label: 'Certifications', icon: Award },
  { type: 'organizational', label: 'Organizational', icon: Users },
] as const;

function normalizeType(type: string): string {
  return type.toLowerCase();
}

export function ExperienceTabs({ experience }: ExperienceTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('work');

  const filteredExperience = experience
    .filter((exp) => normalizeType(exp.type) === activeTab)
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });

  const availableTabs = tabConfig.filter((tab) =>
    experience.some((exp) => normalizeType(exp.type) === tab.type)
  );

  if (experience.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;

          return (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300',
                isActive
                  ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                  : 'text-[#6B7280] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-[#3B82F6] hover:shadow-[6px_6px_10px_rgba(163,177,198,0.7),-6px_-6px_10px_rgba(255,255,255,0.6)]'
              )}
              aria-pressed={isActive}
              aria-label={`Show ${tab.label} entries`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#3B82F6]/20" />

        <div className="space-y-6">
          {filteredExperience.map((exp, index) => (
            <div
              key={exp.id || `${exp.title}-${index}`}
              className="relative pl-10 stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute left-2 top-6 w-4 h-4 rounded-full bg-[#3B82F6] shadow-[2px_2px_4px_rgba(59,130,246,0.3)]" />

              <NeuCard className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div className="flex items-start gap-3">
                    {exp.logoUrl && (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]">
                        <Image
                          src={exp.logoUrl}
                          alt={`${exp.organization} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-bold text-[#3D4852]">{exp.title}</h4>
                      <p className="text-[#3B82F6] font-medium">{exp.organization}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {formatExperienceDate(exp.startDate)} - {formatExperienceDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {exp.description && <p className="text-[#6B7280] mb-4">{exp.description}</p>}

                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 text-xs font-medium text-[#3B82F6] bg-[#E0E5EC] rounded-full shadow-[2px_2px_4px_rgba(163,177,198,0.6),-2px_-2px_4px_rgba(255,255,255,0.5)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </NeuCard>
            </div>
          ))}
        </div>

        {filteredExperience.length === 0 && (
          <div className="pl-10">
            <NeuCard className="text-center text-[#6B7280] p-6">
              No {tabConfig.find((t) => t.type === activeTab)?.label.toLowerCase()} entries to
              display.
            </NeuCard>
          </div>
        )}
      </div>
    </div>
  );
}
