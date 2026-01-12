'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { CreateBlogLinkInput } from '@/lib/validations/blog-link.schema';
import type { BlogLink, FilterType } from '../types/blogs.types';

export function useBlogs() {
  const [blogLinks, setBlogLinks] = useState<BlogLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBlogLink, setEditingBlogLink] = useState<BlogLink | null>(null);
  const [deletingBlogLink, setDeletingBlogLink] = useState<BlogLink | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBlogLinks() {
      try {
        const response = await fetch('/api/v1/admin/blogs', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.success) {
          setBlogLinks(data.data.blogLinks);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to load blog links');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBlogLinks();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredBlogLinks = blogLinks.filter((link) => {
    if (filter === 'visible') return link.visible;
    if (filter === 'hidden') return !link.visible;
    return true;
  });

  const toggleVisibility = useCallback(async (id: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentValue }),
      });
      const data = await response.json();
      if (data.success) {
        setBlogLinks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, visible: !currentValue } : b))
        );
        toast.success('Blog visibility updated');
      }
    } catch {
      toast.error('Failed to update visibility');
    }
  }, []);

  const createBlogLink = useCallback(async (input: CreateBlogLinkInput) => {
    try {
      const payload = {
        ...input,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        description: input.description || null,
        imageUrl: input.imageUrl || null,
      };

      const response = await fetch('/api/v1/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setBlogLinks((prev) => [...prev, result.data]);
        setIsCreateModalOpen(false);
        toast.success('Blog link created successfully');
        return { success: true };
      }
      toast.error('Failed to create blog link');
      return { success: false };
    } catch {
      toast.error('Failed to create blog link');
      return { success: false };
    }
  }, []);

  const updateBlogLink = useCallback(async (id: string, input: CreateBlogLinkInput) => {
    try {
      const payload = {
        ...input,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        description: input.description || null,
        imageUrl: input.imageUrl || null,
      };

      const response = await fetch(`/api/v1/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setBlogLinks((prev) => prev.map((b) => (b.id === id ? result.data : b)));
        setIsEditModalOpen(false);
        setEditingBlogLink(null);
        toast.success('Blog link updated successfully');
        return { success: true };
      }
      toast.error('Failed to update blog link');
      return { success: false };
    } catch {
      toast.error('Failed to update blog link');
      return { success: false };
    }
  }, []);

  const deleteBlogLink = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/v1/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setBlogLinks((prev) => prev.filter((b) => b.id !== id));
        setIsDeleteModalOpen(false);
        setDeletingBlogLink(null);
        toast.success('Blog link deleted successfully');
        return { success: true };
      }
      toast.error('Failed to delete blog link');
      return { success: false };
    } catch {
      toast.error('Failed to delete blog link');
      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const openEditModal = useCallback((blogLink: BlogLink) => {
    setEditingBlogLink(blogLink);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((blogLink: BlogLink) => {
    setDeletingBlogLink(blogLink);
    setIsDeleteModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingBlogLink(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingBlogLink(null);
  }, []);

  return {
    blogLinks,
    filteredBlogLinks,
    loading,
    filter,
    setFilter,
    toggleVisibility,
    createBlogLink,
    updateBlogLink,
    deleteBlogLink,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editingBlogLink,
    deletingBlogLink,
    isDeleting,
    openEditModal,
    openDeleteModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
  };
}
