import { useMemo, useState, type FC } from 'react';
import { NeuCard } from '../shared/NeuCard';
import { Calendar, Briefcase, GraduationCap, Award, Users, MapPin, Building2 } from 'lucide-react';
import type { Experience } from '../../types';

interface ExperienceTabsProps {
  experience?: Experience[];
}

const tabConfig = [
  { type: 'work', label: 'Experience', icon: Briefcase },
  { type: 'education', label: 'Education', icon: GraduationCap },
  { type: 'certification', label: 'Certifications', icon: Award },
  { type: 'organizational', label: 'Organizational', icon: Users },
] as const;

function normalizeType(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized === 'certifications') return 'certification';
  return normalized;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

function formatExperienceDateValue(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const trimmed = value.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!isoMatch) {
    return trimmed;
  }

  const [, year, month, day] = isoMatch;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day ?? '1'));

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function formatExperienceRange(experience: Experience): string {
  const start = formatExperienceDateValue(experience.startDate);
  const end = experience.endDate ? formatExperienceDateValue(experience.endDate) : 'Present';

  if (!start) {
    return end;
  }

  if (!experience.endDate && !/^\d{4}-\d{2}/.test(experience.startDate)) {
    return start;
  }

  return `${start} - ${end}`;
}

function sortExperience(items: Experience[]): Experience[] {
  return [...items].sort((left, right) => right.startDate.localeCompare(left.startDate));
}

function ExperienceLogoPlaceholder() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0E5EC] p-2 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.45),inset_-4px_-4px_8px_rgba(255,255,255,0.45)]">
      <Building2 className="h-6 w-6 text-primary/70" />
    </div>
  );
}

export const ExperienceTabs: FC<ExperienceTabsProps> = ({ experience }) => {
  const items = useMemo(() => sortExperience(experience ?? []), [experience]);
  const availableTabs = useMemo(
    () => tabConfig.filter((tab) => items.some((item) => normalizeType(item.type) === tab.type)),
    [items]
  );
  const [activeTab, setActiveTab] = useState<string>(availableTabs[0]?.type ?? 'work');

  const filteredExperience = items.filter((item) => normalizeType(item.type) === activeTab);

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="sticky top-20 z-30 mb-8 rounded-[24px] bg-[linear-gradient(180deg,rgba(224,229,236,0.94),rgba(224,229,236,0.82))] p-2 backdrop-blur-xl shadow-[0_14px_28px_rgba(163,177,198,0.16)]">
        <div className="flex flex-wrap gap-2">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;

            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-all duration-300',
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
      </div>

      <div className="relative">
        <div className="absolute bottom-0 left-4 top-0 w-[3px] rounded-full bg-[linear-gradient(180deg,rgba(59,130,246,0.18)_0%,rgba(59,130,246,0.85)_18%,rgba(37,99,235,0.95)_50%,rgba(59,130,246,0.38)_100%)] shadow-[0_0_0_1px_rgba(191,219,254,0.55),0_0_18px_rgba(59,130,246,0.22)]" />

        <div className="space-y-6">
          {filteredExperience.map((exp, index) => (
            <div
              key={`${exp.type}-${exp.title}-${index}`}
              className="stagger-item relative pl-10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute left-[5px] top-6 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#dbeafe_0%,#60a5fa_42%,#2563eb_78%,#1d4ed8_100%)] shadow-[0_0_0_5px_rgba(224,236,255,0.92),0_10px_18px_rgba(59,130,246,0.3)]">
                <div className="h-2.5 w-2.5 rounded-full bg-white/80 shadow-[0_0_0_1px_rgba(191,219,254,0.7)]" />
              </div>

              <NeuCard className="p-5 md:p-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    {exp.logoUrl ? (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0E5EC] p-2 shadow-[inset_4px_4px_8px_rgba(163,177,198,0.45),inset_-4px_-4px_8px_rgba(255,255,255,0.45)]">
                        <img
                          src={exp.logoUrl}
                          alt={`${exp.organization} logo`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <ExperienceLogoPlaceholder />
                    )}

                    <div>
                      <h4 className="text-lg font-bold text-foreground">{exp.title}</h4>
                      <p className="font-medium text-primary">{exp.organization}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatExperienceRange(exp)}</span>
                    </div>
                    {exp.location ? (
                      <div className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-3 py-1 text-xs text-primary">
                        <MapPin size={12} />
                        <span>{exp.location}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {exp.description ? (
                  <p className="mb-4 whitespace-pre-line text-muted-foreground">
                    {exp.description}
                  </p>
                ) : null}

                {exp.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={`${exp.title}-${skill}`}
                        className="rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary shadow-[2px_2px_4px_rgba(163,177,198,0.45),-2px_-2px_4px_rgba(255,255,255,0.45)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
              </NeuCard>
            </div>
          ))}
        </div>

        {filteredExperience.length === 0 ? (
          <div className="pl-10">
            <NeuCard className="p-6 text-center text-muted-foreground">
              No {tabConfig.find((tab) => tab.type === activeTab)?.label.toLowerCase()} entries to
              display.
            </NeuCard>
          </div>
        ) : null}
      </div>
    </div>
  );
};
