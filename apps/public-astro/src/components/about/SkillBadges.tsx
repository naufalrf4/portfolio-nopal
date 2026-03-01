import type { FC } from 'react';
import { NeuBadge } from '../shared/NeuBadge';
import type { Skill } from '../../types';

interface SkillBadgesProps {
  skills: Skill[];
}

export const SkillBadges: FC<SkillBadgesProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return null;
  }

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groupedSkills).sort();

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="animate-fade-in-up">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {category}
          </h4>
          <div className="flex flex-wrap gap-2">
            {groupedSkills[category].map((skill, index) => (
              <div
                key={`${category}-${skill.name}-${index}`}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <NeuBadge size="md" variant="default">
                  {skill.name}
                </NeuBadge>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
