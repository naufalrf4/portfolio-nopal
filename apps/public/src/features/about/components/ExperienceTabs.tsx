'use client';

import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { NeuCard } from '@/src/features/shared/components';
import { Calendar, MapPin, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import type { Experience } from './types';

interface ExperienceTabsProps {
  experience: Experience[];
}

const tabConfig = [
  { type: 'work', label: 'Work', icon: Briefcase },
  { type: 'education', label: 'Education', icon: GraduationCap },
  { type: 'certification', label: 'Certifications', icon: Award },
  { type: 'organization', label: 'Organizations', icon: Users },
] as const;

export function ExperienceTabs({ experience }: ExperienceTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('work');

  const filteredExperience = experience
    .filter((exp) => exp.type === activeTab)
    .sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });

  const availableTabs = tabConfig.filter((tab) => experience.some((exp) => exp.type === tab.type));

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
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? 'text-[#3B82F6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                  : 'text-[#6B7280] shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-[#3B82F6]'
              )}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#3B82F6]/20" />

        <div className="space-y-6">
          {filteredExperience.map((exp) => (
            <div key={exp.id} className="relative pl-10">
              <div className="absolute left-2 top-6 w-4 h-4 rounded-full bg-[#3B82F6] shadow-[2px_2px_4px_rgba(59,130,246,0.3)]" />

              <NeuCard>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-[#3D4852]">{exp.title}</h4>
                    <p className="text-[#3B82F6] font-medium">{exp.organization}</p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {exp.startDate} - {exp.endDate || 'Present'}
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
                    {exp.skills.map((skill, index) => (
                      <span
                        key={index}
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
            <NeuCard className="text-center text-[#6B7280]">
              No {activeTab} experience to display.
            </NeuCard>
          </div>
        )}
      </div>
    </div>
  );
}
