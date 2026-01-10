'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectFormProps {
  projectId?: string;
}

interface ProjectFormData {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  techStack: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    summary: '',
    description: '',
    category: '',
    techStack: '',
    liveUrl: '',
    repoUrl: '',
    featured: false,
    visible: true,
    order: 0,
  });

  useEffect(() => {
    if (!projectId) return;

    const controller = new AbortController();

    async function fetchProject() {
      try {
        const response = await fetch(`/api/v1/admin/projects/${projectId}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) {
          setFormData({
            title: data.data.title,
            slug: data.data.slug,
            summary: data.data.summary,
            description: data.data.description || '',
            category: data.data.category,
            techStack: data.data.techStack.join(', '),
            liveUrl: data.data.liveUrl || '',
            repoUrl: data.data.repoUrl || '',
            featured: data.data.featured,
            visible: data.data.visible,
            order: data.data.order,
          });
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Error fetching project
        }
      }
    }

    fetchProject();

    return () => {
      controller.abort();
    };
  }, [projectId]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSwitchChange(name: keyof ProjectFormData, checked: boolean) {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: projectId ? prev.slug : generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        liveUrl: formData.liveUrl || undefined,
        repoUrl: formData.repoUrl || undefined,
        description: formData.description || undefined,
      };

      const url = projectId ? `/api/v1/admin/projects/${projectId}` : '/api/v1/admin/projects';
      const method = projectId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/projects');
      } else {
        alert('Failed to save project: ' + JSON.stringify(data.error));
      }
    } catch {
      alert('An error occurred while saving the project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{projectId ? 'Edit Project' : 'Create Project'}</h1>
          <p className="text-muted-foreground">
            {projectId
              ? 'Update project details and contexts'
              : 'Add a new project to your portfolio'}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/projects')}>
          Back to Projects
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="web, mobile, backend, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack * (comma-separated)</Label>
                <Input
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="React, TypeScript, Node.js"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Repository URL</Label>
                <Input
                  id="repoUrl"
                  name="repoUrl"
                  type="url"
                  value={formData.repoUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => handleSwitchChange('visible', checked)}
                />
                <Label htmlFor="visible">Visible</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/projects')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : projectId ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
