import { useState, type FC } from 'react';
import { NeuCard } from '../shared/NeuCard';
import { Calendar, Briefcase, GraduationCap, Award, Users } from 'lucide-react';
import type { Experience } from '../../types';

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

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const ExperienceTabs: FC<ExperienceTabsProps> = ({ experience }) => {
  const [activeTab, setActiveTab] = useState<string>('work');

  const filteredExperience = experience.filter((exp) => normalizeType(exp.type) === activeTab);
  // Removed sorting as target type doesn't support startDate

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
                  ? 'text-primary shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]'
                  : 'text-muted-foreground shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)] hover:text-primary hover:shadow-[6px_6px_10px_rgba(163,177,198,0.7),-6px_-6px_10px_rgba(255,255,255,0.6)]'
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
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20" />

        <div className="space-y-6">
          {filteredExperience.map((exp, index) => (
            <div
              key={`${exp.title}-${index}`}
              className="relative pl-10 stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute left-2 top-6 w-4 h-4 rounded-full bg-primary shadow-[2px_2px_4px_rgba(var(--color-primary),0.3)]" />

              <NeuCard className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                  <div className="flex items-start gap-3">
                    {/* Removed logoUrl logic as it's not in Experience type */}
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{exp.title}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                    {/* Removed location logic as it's not in Experience type */}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-muted-foreground mb-4 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}

                {/* Removed skills logic as it's not in Experience type */}
              </NeuCard>
            </div>
          ))}
        </div>

        {filteredExperience.length === 0 && (
          <div className="pl-10">
            <NeuCard className="text-center text-muted-foreground p-6">
              No {tabConfig.find((t) => t.type === activeTab)?.label.toLowerCase()} entries to
              display.
            </NeuCard>
          </div>
        )}
      </div>
    </div>
  );
};
