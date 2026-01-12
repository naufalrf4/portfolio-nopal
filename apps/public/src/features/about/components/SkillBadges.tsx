import { cn } from '@/src/lib/utils';
import { NeuBadge } from '@/src/features/shared/components';
import type { Skill } from './types';

interface SkillBadgesProps {
  skills: Skill[];
}

export function SkillBadges({ skills }: SkillBadgesProps) {
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills).sort();

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category}>
          <h4 className="text-lg font-semibold text-[#3D4852] mb-4">{category}</h4>
          <div className="flex flex-wrap gap-3">
            {groupedSkills[category].map((skill, index) => (
              <NeuBadge key={index} size="md" variant="default">
                {skill.name}
              </NeuBadge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
