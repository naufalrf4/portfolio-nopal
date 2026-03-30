'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { AboutSkill } from '../types/about.types';
import { useAbout } from '../hooks/useAbout';

const DEFAULT_LEVEL = 85;
const DEFAULT_CATEGORY = 'Tools & Workflow';

type SkillGroupDraft = {
  category: string;
  skillsText: string;
};

export function SkillsTab() {
  const { data, updateAbout, saving } = useAbout();

  const [skills, setSkills] = useState<AboutSkill[]>([]);
  const [skillGroups, setSkillGroups] = useState<SkillGroupDraft[]>([
    { category: DEFAULT_CATEGORY, skillsText: '' },
  ]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setSkills(data.skills || []);
      const grouped = (data.skills || []).reduce<Record<string, string[]>>((acc, skill) => {
        const category = skill.category || DEFAULT_CATEGORY;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill.name);
        return acc;
      }, {});

      const drafts = Object.entries(grouped).map(([category, groupedSkills]) => ({
        category,
        skillsText: groupedSkills.join(', '),
      }));

      setSkillGroups(drafts.length > 0 ? drafts : [{ category: DEFAULT_CATEGORY, skillsText: '' }]);
      setHasUnsavedChanges(false);
    }
  }, [data]);

  const syncSkillsFromGroups = (groups: SkillGroupDraft[]) => {
    const nextSkills: AboutSkill[] = [];
    const seen = new Set<string>();

    for (const group of groups) {
      const category = group.category.trim() || DEFAULT_CATEGORY;
      const parsedSkills = group.skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      for (const skillName of parsedSkills) {
        const key = skillName.toLowerCase();
        if (seen.has(key)) {
          continue;
        }

        seen.add(key);
        nextSkills.push({
          name: skillName,
          category,
          level: DEFAULT_LEVEL,
        });
      }
    }

    setSkills(nextSkills);
    setHasUnsavedChanges(true);
  };

  const updateGroup = (index: number, patch: Partial<SkillGroupDraft>) => {
    const nextGroups = skillGroups.map((group, groupIndex) =>
      groupIndex === index ? { ...group, ...patch } : group
    );
    setSkillGroups(nextGroups);
    syncSkillsFromGroups(nextGroups);
  };

  const addGroup = () => {
    setSkillGroups((current) => [...current, { category: '', skillsText: '' }]);
    setHasUnsavedChanges(true);
  };

  const removeGroup = (index: number) => {
    const nextGroups = skillGroups.filter((_, groupIndex) => groupIndex !== index);
    const normalizedGroups =
      nextGroups.length > 0 ? nextGroups : [{ category: DEFAULT_CATEGORY, skillsText: '' }];
    setSkillGroups(normalizedGroups);
    syncSkillsFromGroups(normalizedGroups);
  };

  const groupedSkills = skills.reduce<Record<string, AboutSkill[]>>((acc, skill) => {
    const category = skill.category || DEFAULT_CATEGORY;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  const groupedCategories = Object.keys(groupedSkills).sort();

  const removeSkill = (skillToRemove: string, category: string) => {
    const nextGroups = skillGroups.map((group) => {
      if ((group.category.trim() || DEFAULT_CATEGORY) !== category) {
        return group;
      }

      const nextSkillsText = group.skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill && skill.toLowerCase() !== skillToRemove.toLowerCase())
        .join(', ');

      return {
        ...group,
        skillsText: nextSkillsText,
      };
    });

    setSkillGroups(nextGroups);
    syncSkillsFromGroups(nextGroups);
  };

  const handleSave = async () => {
    if (!data) return;

    const bioString = data.bio
      ? typeof data.bio === 'string'
        ? data.bio
        : JSON.stringify(data.bio)
      : undefined;

    const success = await updateAbout({
      fullName: data.fullName,
      email: data.email,
      skills,
      roles: data.roles || [],
      tagline: data.tagline ?? undefined,
      shortBio: data.shortBio ?? undefined,
      bio: bioString,
      phone: data.phone ?? undefined,
      location: data.location ?? undefined,
      avatarUrl: data.avatarUrl ?? undefined,
      resumeUrl: data.resumeUrl ?? undefined,
      experience: data.experience ?? undefined,
    });

    if (success) {
      setHasUnsavedChanges(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#3D4852]">Skills</h3>
            <p className="text-sm text-[#6B7280]">
              Add your skills. Click &quot;Save Changes&quot; to save.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && !saving && (
              <span className="text-sm text-amber-600">Unsaved changes</span>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saving}
              size="sm"
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Skill Groups</Label>
            <Button variant="outline" size="sm" onClick={addGroup}>
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>
          </div>
          <p className="text-xs text-[#6B7280]">
            Add a category label, then list skills separated by commas. Example: React, Next.js,
            TypeScript.
          </p>
          <div className="space-y-3">
            {skillGroups.map((group, index) => (
              <div
                key={`${group.category || 'group'}-${index}`}
                className="grid gap-3 rounded-2xl border border-[#A3B1C6]/15 bg-[#E0E5EC]/70 p-4 md:grid-cols-[220px_minmax(0,1fr)_auto]"
              >
                <Input
                  value={group.category}
                  onChange={(event) => updateGroup(index, { category: event.target.value })}
                  placeholder="Category label"
                />
                <Input
                  value={group.skillsText}
                  onChange={(event) => updateGroup(index, { skillsText: event.target.value })}
                  placeholder="skill1, skill2, skill3"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeGroup(index)}
                  aria-label={`Remove ${group.category || 'skill group'}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <Label>Your Skills ({skills.length})</Label>
            <div className="space-y-4 mt-3">
              {groupedCategories.map((category) => (
                <div key={category} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groupedSkills[category].map((skill) => (
                      <div
                        key={`${skill.category}-${skill.name}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E0E5EC] text-[#3D4852] text-sm shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]"
                      >
                        <span className="font-medium">{skill.name}</span>
                        <button
                          onClick={() => removeSkill(skill.name, category)}
                          className="text-[#6B7280] hover:text-red-500 transition-colors"
                          aria-label={`Remove ${skill.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
