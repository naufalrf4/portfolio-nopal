'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAbout } from '../hooks/useAbout';

export function SkillsTab() {
  const { data, updateAbout, saving } = useAbout();

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setSkills(data.skills || []);
      setHasUnsavedChanges(false);
    }
  }, [data]);

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const newSkills = [...skills, trimmedSkill];
      setSkills(newSkills);
      setSkillInput('');
      setHasUnsavedChanges(true);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(newSkills);
    setHasUnsavedChanges(true);
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
          <Label htmlFor="skillInput">Add Skill</Label>
          <div className="flex gap-2">
            <Input
              id="skillInput"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type and press Enter to add"
            />
            <Button onClick={addSkill} disabled={!skillInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <Label>Your Skills ({skills.length})</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E0E5EC] text-[#3D4852] text-sm shadow-[3px_3px_6px_rgba(163,177,198,0.6),-3px_-3px_6px_rgba(255,255,255,0.5)]"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-[#6B7280] hover:text-red-500 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
