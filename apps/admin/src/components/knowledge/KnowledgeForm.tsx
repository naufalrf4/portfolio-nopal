'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const knowledgeDocSchema = z.object({
  filename: z.string().min(1, 'Filename is required').max(255, 'Filename too long'),
  content: z.string().min(1, 'Content is required'),
});

type KnowledgeDocFormData = z.infer<typeof knowledgeDocSchema>;

interface KnowledgeDoc {
  id: string;
  filename: string;
  content: string;
  indexed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeFormProps {
  doc?: KnowledgeDoc | null;
  onSubmit: (data: KnowledgeDocFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export function KnowledgeForm({ doc, onSubmit, isSubmitting }: KnowledgeFormProps) {
  const router = useRouter();
  const isEditing = !!doc;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KnowledgeDocFormData>({
    resolver: zodResolver(knowledgeDocSchema),
    defaultValues: {
      filename: doc?.filename || '',
      content: doc?.content || '',
    },
  });

  useEffect(() => {
    if (doc) {
      reset({
        filename: doc.filename,
        content: doc.content,
      });
    }
  }, [doc, reset]);

  const onFormSubmit = async (data: KnowledgeDocFormData) => {
    const success = await onSubmit(data);
    if (success) {
      router.push('/knowledge');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isEditing ? 'Edit Document' : 'Create Document'}</CardTitle>
            <CardDescription>
              {isEditing
                ? 'Update the knowledge document content'
                : 'Add a new document to the knowledge base'}
            </CardDescription>
          </div>
          {doc && (
            <Badge variant={doc.indexed ? 'success' : 'warning'}>
              {doc.indexed ? 'Indexed' : 'Pending Indexing'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="filename" className="block text-sm font-medium text-[#3D4852]">
              Filename
            </label>
            <Input
              id="filename"
              placeholder="e.g., about-me.md, project-docs.txt"
              {...register('filename')}
              aria-invalid={!!errors.filename}
            />
            {errors.filename && <p className="text-sm text-red-500">{errors.filename.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-[#3D4852]">
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Enter the document content..."
              className="min-h-[300px] font-mono text-sm"
              {...register('content')}
              aria-invalid={!!errors.content}
            />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
            <p className="text-xs text-[#6B7280]">
              Supports plain text and markdown format. The content will be chunked and indexed for
              RAG retrieval.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update Document' : 'Create Document'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
