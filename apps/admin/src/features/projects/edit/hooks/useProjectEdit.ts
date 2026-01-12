'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { getErrorMessage } from '@/lib/utils/api';
import type { ProjectEdit } from '../types';

export function useProjectEdit(id: string) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectEdit | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [debouncedContent] = useDebounce(content, 1000);

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project && debouncedContent !== (project.content || '')) {
      saveContent(debouncedContent);
    }
  }, [debouncedContent]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/v1/admin/projects/${id}`);
      const data = await response.json();

      if (!data.success) {
        toast.error('Project not found');
        router.push('/projects');
        return;
      }

      const projectData = data.data;
      setProject(projectData);

      let parsedContent = projectData.content || '';
      if (typeof parsedContent === 'string' && parsedContent.trim().startsWith('{')) {
        try {
          parsedContent = JSON.parse(parsedContent);
        } catch {}
      }
      setContent(parsedContent);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (newContent: string) => {
    if (!project || !newContent) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/v1/admin/projects/${project.id}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save content');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to save content');
      }

      setProject({ ...project, content: newContent });
      toast.success('Content saved');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save content'));
    } finally {
      setSaving(false);
    }
  };

  return {
    project,
    loading,
    content,
    setContent,
    saving,
    debouncedContent,
    fetchProject,
  };
}
