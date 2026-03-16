'use client';

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAbout } from '@/features/about/hooks/useAbout';
import type {
  FreelanceFeaturePrice,
  FreelanceProfile,
  FreelanceProjectReference,
} from '@/features/about/types/about.types';

const EMPTY_PROFILE: FreelanceProfile = {
  hourlyRate: null,
  currency: 'IDR',
  completedProjects: null,
  pricingNotes: '',
  featurePricing: [],
  projectReferences: [],
};

function normalizeProfile(profile?: FreelanceProfile | null): FreelanceProfile {
  if (!profile) {
    return {
      ...EMPTY_PROFILE,
      featurePricing: [],
      projectReferences: [],
    };
  }

  return {
    hourlyRate: profile.hourlyRate ?? null,
    currency: profile.currency?.trim() || 'IDR',
    completedProjects: profile.completedProjects ?? null,
    pricingNotes: profile.pricingNotes ?? '',
    featurePricing: [...(profile.featurePricing ?? [])],
    projectReferences: [...(profile.projectReferences ?? [])],
  };
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function FreelanceToolPanel() {
  const { data, loading, saving, updateField } = useAbout();
  const [draft, setDraft] = useState<FreelanceProfile>(EMPTY_PROFILE);

  useEffect(() => {
    if (data) {
      setDraft(normalizeProfile(data.freelanceProfile));
    }
  }, [data]);

  const featureCount = draft.featurePricing?.length ?? 0;
  const projectCount = draft.projectReferences?.length ?? 0;
  const normalizedProfile = useMemo(() => normalizeProfile(draft), [draft]);

  const updateFeature = (
    index: number,
    updater: (item: FreelanceFeaturePrice) => FreelanceFeaturePrice
  ) => {
    setDraft((current) => ({
      ...current,
      featurePricing: (current.featurePricing ?? []).map((item, itemIndex) =>
        itemIndex === index ? updater(item) : item
      ),
    }));
  };

  const updateProjectReference = (
    index: number,
    updater: (item: FreelanceProjectReference) => FreelanceProjectReference
  ) => {
    setDraft((current) => ({
      ...current,
      projectReferences: (current.projectReferences ?? []).map((item, itemIndex) =>
        itemIndex === index ? updater(item) : item
      ),
    }));
  };

  if (loading && !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Freelance Tool</CardTitle>
          <CardDescription>Loading freelance reference profile...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-[#2563EB]" />
                Freelance Tool Profile
              </CardTitle>
              <CardDescription className="mt-2 max-w-3xl">
                This intent profile powers freelance pricing and quote workflows. The chat API loads
                this data only when the active tool needs it, so future intents can stay isolated
                instead of shipping every dataset on every request.
              </CardDescription>
            </div>
            <Button
              variant="primary"
              onClick={() => void updateField('freelanceProfile', normalizedProfile)}
              disabled={saving || !data}
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Tool Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#E9EEF5] p-4 shadow-[inset_4px_4px_10px_rgba(163,177,198,0.24),inset_-4px_-4px_10px_rgba(255,255,255,0.32)]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">Hourly Rate</div>
              <div className="mt-2 text-2xl font-bold text-[#2563EB]">
                {draft.hourlyRate
                  ? `${draft.currency || 'IDR'} ${draft.hourlyRate.toLocaleString('en-US')}`
                  : 'Not set'}
              </div>
            </div>
            <div className="rounded-2xl bg-[#E9EEF5] p-4 shadow-[inset_4px_4px_10px_rgba(163,177,198,0.24),inset_-4px_-4px_10px_rgba(255,255,255,0.32)]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">
                Completed Jobs
              </div>
              <div className="mt-2 text-2xl font-bold text-[#2563EB]">
                {draft.completedProjects ?? 0}
              </div>
            </div>
            <div className="rounded-2xl bg-[#E9EEF5] p-4 shadow-[inset_4px_4px_10px_rgba(163,177,198,0.24),inset_-4px_-4px_10px_rgba(255,255,255,0.32)]">
              <div className="text-xs uppercase tracking-[0.16em] text-[#6B7280]">
                Intent Assets
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm text-[#3D4852]">
                <span>{featureCount} feature refs</span>
                <span>{projectCount} project refs</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3D4852]">Hourly Rate</label>
              <Input
                inputMode="decimal"
                value={draft.hourlyRate ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    hourlyRate: parseOptionalNumber(event.target.value),
                  }))
                }
                placeholder="150000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3D4852]">Currency</label>
              <Input
                value={draft.currency ?? 'IDR'}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    currency: event.target.value.toUpperCase(),
                  }))
                }
                placeholder="IDR"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#3D4852]">Completed Projects</label>
              <Input
                inputMode="numeric"
                value={draft.completedProjects ?? ''}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    completedProjects: parseOptionalNumber(event.target.value),
                  }))
                }
                placeholder="12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#3D4852]">Pricing Notes</label>
            <Textarea
              value={draft.pricingNotes ?? ''}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  pricingNotes: event.target.value,
                }))
              }
              placeholder="Notes the pricing tool should keep in mind before producing a quote."
              className="min-h-28"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Feature Reference Prices</CardTitle>
              <CardDescription>
                Add reusable feature-level references that the pricing tool can match against module
                requirements.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  featurePricing: [
                    ...(current.featurePricing ?? []),
                    { feature: '', price: null, notes: '', relatedProjectSlugs: [] },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(draft.featurePricing ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#C9D4E3] px-4 py-6 text-sm text-[#6B7280]">
              No feature references yet. Add the scoped features you quote often so the pricing tool
              can stay deterministic.
            </div>
          ) : null}

          {(draft.featurePricing ?? []).map((item, index) => (
            <div
              key={`feature-${index}`}
              className="rounded-[28px] border border-[#D5DEE9] p-4 shadow-[inset_3px_3px_8px_rgba(163,177,198,0.16),inset_-3px_-3px_8px_rgba(255,255,255,0.24)]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3D4852]">
                  <Sparkles className="h-4 w-4 text-[#2563EB]" />
                  Reference #{index + 1}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      featurePricing: (current.featurePricing ?? []).filter(
                        (_, itemIndex) => itemIndex !== index
                      ),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3D4852]">Feature Name</label>
                  <Input
                    value={item.feature}
                    onChange={(event) =>
                      updateFeature(index, (current) => ({
                        ...current,
                        feature: event.target.value,
                      }))
                    }
                    placeholder="Drizzle authentication system"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3D4852]">Reference Price</label>
                  <Input
                    inputMode="decimal"
                    value={item.price ?? ''}
                    onChange={(event) =>
                      updateFeature(index, (current) => ({
                        ...current,
                        price: parseOptionalNumber(event.target.value),
                      }))
                    }
                    placeholder="1000000"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3D4852]">
                    Related Project Slugs
                  </label>
                  <Input
                    value={(item.relatedProjectSlugs ?? []).join(', ')}
                    onChange={(event) =>
                      updateFeature(index, (current) => ({
                        ...current,
                        relatedProjectSlugs: event.target.value
                          .split(',')
                          .map((slug) => slug.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="naufalrf-portfolio, ai-rag-assistant"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3D4852]">Notes</label>
                  <Textarea
                    value={item.notes ?? ''}
                    onChange={(event) =>
                      updateFeature(index, (current) => ({ ...current, notes: event.target.value }))
                    }
                    placeholder="What this reference includes."
                    className="min-h-24"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Project References</CardTitle>
              <CardDescription>
                Link reusable project references so future intent handlers can connect pricing items
                back to concrete portfolio work.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  projectReferences: [
                    ...(current.projectReferences ?? []),
                    { slug: '', title: '', notes: '' },
                  ],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add Project Reference
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(draft.projectReferences ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#C9D4E3] px-4 py-6 text-sm text-[#6B7280]">
              No project references yet. Add project slugs here so quote workflows can mention the
              most relevant portfolio examples without loading every future intent dataset.
            </div>
          ) : null}

          {(draft.projectReferences ?? []).map((item, index) => (
            <div
              key={`project-reference-${index}`}
              className="rounded-[28px] border border-[#D5DEE9] p-4 shadow-[inset_3px_3px_8px_rgba(163,177,198,0.16),inset_-3px_-3px_8px_rgba(255,255,255,0.24)]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[#3D4852]">Project #{index + 1}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      projectReferences: (current.projectReferences ?? []).filter(
                        (_, itemIndex) => itemIndex !== index
                      ),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3D4852]">Project Slug</label>
                  <Input
                    value={item.slug}
                    onChange={(event) =>
                      updateProjectReference(index, (current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                    placeholder="naufalrf-portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#3D4852]">Display Title</label>
                  <Input
                    value={item.title}
                    onChange={(event) =>
                      updateProjectReference(index, (current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="NaufalRF Portfolio Platform"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-[#3D4852]">Notes</label>
                <Textarea
                  value={item.notes ?? ''}
                  onChange={(event) =>
                    updateProjectReference(index, (current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Why this project matters as a reference for the tool."
                  className="min-h-24"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
