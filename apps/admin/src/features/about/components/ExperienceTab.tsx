'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FloatingActionButton } from '@/components/layout/FloatingActionButton';
import { useAbout } from '../hooks/useAbout';
import { filterExperienceByType } from '../utils/formatters';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceModal } from './ExperienceModal';
import type { ExperienceItem, ExperienceType } from '../types/about.types';

export function ExperienceTab() {
  const { data, updateAbout, saving } = useAbout();

  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [experienceSubTab, setExperienceSubTab] = useState('education');
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<
    (ExperienceItem & { index?: number }) | null
  >(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setExperience(data.experience || []);
      setHasUnsavedChanges(false);
    }
  }, [data]);

  const handleAddExperience = (type: ExperienceType) => {
    setEditingExperience({
      type,
      title: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: null,
      description: '',
      logoUrl: '',
    });
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (item: ExperienceItem, index: number) => {
    setEditingExperience({ ...item, index });
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = async (item: ExperienceItem) => {
    let updatedExperience: ExperienceItem[];

    if (editingExperience?.index !== undefined) {
      updatedExperience = [...experience];
      updatedExperience[editingExperience.index] = item;
    } else {
      updatedExperience = [...experience, item];
    }

    setExperience(updatedExperience);
    setIsExperienceModalOpen(false);
    setEditingExperience(null);
    setHasUnsavedChanges(true);
  };

  const handleDeleteExperience = async (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!data) return;

    const bioString = data.bio
      ? typeof data.bio === 'string'
        ? data.bio
        : JSON.stringify(data.bio)
      : undefined;

    const success = await updateAbout({
      fullName: data.fullName,
      email: data.email,
      experience,
      roles: data.roles || [],
      tagline: data.tagline ?? undefined,
      bio: bioString,
      phone: data.phone ?? undefined,
      location: data.location ?? undefined,
      avatarUrl: data.avatarUrl ?? undefined,
      resumeUrl: data.resumeUrl ?? undefined,
      skills: data.skills,
      socialLinks: data.socialLinks ?? undefined,
    });

    if (success) {
      setHasUnsavedChanges(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#3D4852]">Experience</h3>
              <p className="text-sm text-[#6B7280]">
                Add and manage your education, work, and organizational experience. Click &quot;Save
                Changes&quot; to save.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && !saving && (
                <span className="text-sm text-amber-600">Unsaved changes</span>
              )}
              <Button
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges || saving}
                size="sm"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white disabled:bg-gray-300 disabled:text-gray-500"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          <Tabs value={experienceSubTab} onValueChange={setExperienceSubTab}>
            <TabsList className="mb-4 grid grid-cols-3 h-auto">
              <TabsTrigger value="education" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Education</span>
                <span className="sm:hidden">Edu</span>
                <span className="ml-1">
                  ({filterExperienceByType(experience, 'Education').length})
                </span>
              </TabsTrigger>
              <TabsTrigger value="work" className="text-xs sm:text-sm">
                Work ({filterExperienceByType(experience, 'Work').length})
              </TabsTrigger>
              <TabsTrigger value="organizational" className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Organizational</span>
                <span className="sm:hidden">Org</span>
                <span className="ml-1">
                  ({filterExperienceByType(experience, 'Organizational').length})
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="education">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label>
                    Education ({filterExperienceByType(experience, 'Education').length})
                  </Label>
                  <Button
                    variant="primary"
                    onClick={() => handleAddExperience('Education')}
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Plus className="h-4 w-4" />
                    Add Education
                  </Button>
                </div>

                {filterExperienceByType(experience, 'Education').length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-8">
                    No education added yet. Click the button above to add your first entry.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {experience
                      .map((item, index) => ({ item, index }))
                      .filter(({ item }) => item.type === 'Education')
                      .map(({ item, index }) => (
                        <ExperienceCard
                          key={index}
                          experience={item}
                          onEdit={() => handleEditExperience(item, index)}
                          onDelete={() => handleDeleteExperience(index)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="work">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label>
                    Work Experience ({filterExperienceByType(experience, 'Work').length})
                  </Label>
                  <Button
                    variant="primary"
                    onClick={() => handleAddExperience('Work')}
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Plus className="h-4 w-4" />
                    Add Work Experience
                  </Button>
                </div>

                {filterExperienceByType(experience, 'Work').length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-8">
                    No work experience added yet. Click the button above to add your first entry.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {experience
                      .map((item, index) => ({ item, index }))
                      .filter(({ item }) => item.type === 'Work')
                      .map(({ item, index }) => (
                        <ExperienceCard
                          key={index}
                          experience={item}
                          onEdit={() => handleEditExperience(item, index)}
                          onDelete={() => handleDeleteExperience(index)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="organizational">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label>
                    Organizational ({filterExperienceByType(experience, 'Organizational').length})
                  </Label>
                  <Button
                    variant="primary"
                    onClick={() => handleAddExperience('Organizational')}
                    size="sm"
                    className="hidden md:flex"
                  >
                    <Plus className="h-4 w-4" />
                    Add Organizational
                  </Button>
                </div>

                {filterExperienceByType(experience, 'Organizational').length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-8">
                    No organizational experience added yet. Click the button above to add your first
                    entry.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {experience
                      .map((item, index) => ({ item, index }))
                      .filter(({ item }) => item.type === 'Organizational')
                      .map(({ item, index }) => (
                        <ExperienceCard
                          key={index}
                          experience={item}
                          onEdit={() => handleEditExperience(item, index)}
                          onDelete={() => handleDeleteExperience(index)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FloatingActionButton
        onClick={() => {
          if (experienceSubTab === 'education') handleAddExperience('Education');
          else if (experienceSubTab === 'work') handleAddExperience('Work');
          else handleAddExperience('Organizational');
        }}
        label="Add Experience"
      />

      <ExperienceModal
        open={isExperienceModalOpen}
        onOpenChange={setIsExperienceModalOpen}
        editingExperience={editingExperience}
        onSave={handleSaveExperience}
      />
    </>
  );
}
