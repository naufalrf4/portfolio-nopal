'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBlogLinkSchema, type CreateBlogLinkInput } from '@/lib/validations/blog-link.schema';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { INPUT_CLASS_NAME, INPUT_STYLE, NEUMORPHIC_STYLES } from '../constants/blogs.constants';
import type { BlogLink } from '../types/blogs.types';

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBlogLinkInput) => Promise<void>;
  blogLink: BlogLink | null;
}

export function EditBlogModal({ isOpen, onClose, onSubmit, blogLink }: EditBlogModalProps) {
  const form = useForm<CreateBlogLinkInput>({
    resolver: zodResolver(createBlogLinkSchema),
  });

  useEffect(() => {
    if (blogLink) {
      const publishedDate = blogLink.publishedAt
        ? new Date(blogLink.publishedAt).toISOString().split('T')[0]
        : '';

      form.reset({
        url: blogLink.url,
        title: blogLink.title,
        description: blogLink.description || '',
        imageUrl: blogLink.imageUrl || '',
        source: blogLink.source,
        publishedAt: publishedDate,
      });
    }
  }, [blogLink, form]);

  async function handleSubmit(data: CreateBlogLinkInput) {
    await onSubmit(data);
    form.reset();
  }

  function handleClose() {
    onClose();
    form.reset();
  }

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Edit Blog Link"
      description="Update the blog article information."
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={form.formState.isSubmitting}
            form="edit-blog-form"
          >
            {form.formState.isSubmitting ? 'Updating...' : 'Update Link'}
          </Button>
        </>
      }
    >
      <form id="edit-blog-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="edit-url"
            className="block text-sm font-semibold"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            URL <span style={{ color: NEUMORPHIC_STYLES.accent }}>*</span>
          </label>
          <input
            id="edit-url"
            type="url"
            placeholder="https://example.com/blog/article"
            className={INPUT_CLASS_NAME}
            style={INPUT_STYLE}
            {...form.register('url')}
          />
          {form.formState.errors.url && (
            <p className="text-sm text-red-500 pl-2">{form.formState.errors.url.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-title"
            className="block text-sm font-semibold"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            Title <span style={{ color: NEUMORPHIC_STYLES.accent }}>*</span>
          </label>
          <input
            id="edit-title"
            type="text"
            placeholder="Article title"
            className={INPUT_CLASS_NAME}
            style={INPUT_STYLE}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 pl-2">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-source"
            className="block text-sm font-semibold"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            Source <span style={{ color: NEUMORPHIC_STYLES.accent }}>*</span>
          </label>
          <input
            id="edit-source"
            type="text"
            placeholder="Medium, Dev.to, Personal Blog, etc."
            className={INPUT_CLASS_NAME}
            style={INPUT_STYLE}
            {...form.register('source')}
          />
          {form.formState.errors.source && (
            <p className="text-sm text-red-500 pl-2">{form.formState.errors.source.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-description"
            className="block text-sm font-semibold"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            Description
          </label>
          <textarea
            id="edit-description"
            placeholder="Brief description of the article"
            rows={3}
            className={`${INPUT_CLASS_NAME} resize-none`}
            style={INPUT_STYLE}
            {...form.register('description')}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-imageUrl"
            className="block text-sm font-semibold"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            Image URL
          </label>
          <input
            id="edit-imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            className={INPUT_CLASS_NAME}
            style={INPUT_STYLE}
            {...form.register('imageUrl')}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="edit-publishedAt"
            className="block text-sm font-semibold"
            style={{ color: NEUMORPHIC_STYLES.foreground }}
          >
            Published Date
          </label>
          <input
            id="edit-publishedAt"
            type="date"
            className={INPUT_CLASS_NAME}
            style={INPUT_STYLE}
            {...form.register('publishedAt')}
          />
        </div>
      </form>
    </ResponsiveModal>
  );
}
