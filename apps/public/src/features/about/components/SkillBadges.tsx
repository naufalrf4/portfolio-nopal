import { NeuBadge } from '@/src/features/shared/components';
import type { Skill } from './types';

interface SkillBadgesProps {
  skills: Skill[] | string[];
}

function isSkillObject(skill: Skill | string): skill is Skill {
  return typeof skill === 'object' && skill !== null && 'name' in skill;
}

export function SkillBadges({ skills }: SkillBadgesProps) {
  if (skills.length === 0) {
    return null;
  }

  const firstSkill = skills[0];
  const isObjectArray = isSkillObject(firstSkill);

  if (isObjectArray) {
    const skillObjects = skills as Skill[];
    const groupedSkills = skillObjects.reduce<Record<string, Skill[]>>((acc, skill) => {
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
          <div key={category}>
            <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
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

  const skillStrings = skills as string[];
  return (
    <div className="flex flex-wrap gap-2">
      {skillStrings.map((skill, index) => (
        <NeuBadge key={index} size="md" variant="default">
          {skill}
        </NeuBadge>
      ))}
    </div>
  );
}
