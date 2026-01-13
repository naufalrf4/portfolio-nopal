'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { extractTextFromFile } from '@/lib/utils/file-extractor';

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
  const [inputMode, setInputMode] = useState<'manual' | 'upload'>('manual');
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setValue('filename', selectedFile.name);
  };

  const onFormSubmit = async (data: KnowledgeDocFormData) => {
    let content = data.content;

    if (inputMode === 'upload' && file) {
      setIsExtracting(true);
      try {
        content = await extractTextFromFile(file);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to extract text from file: ${message}`);
        setIsExtracting(false);
        return;
      } finally {
        setIsExtracting(false);
      }
    }

    const success = await onSubmit({ ...data, content });
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

            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'manual' | 'upload')}>
              <TabsList className="w-full">
                <TabsTrigger value="manual" className="flex-1">
                  Manual Input
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-4">
                <Textarea
                  id="content"
                  placeholder="Enter the document content..."
                  className="min-h-[300px] font-mono text-sm"
                  {...register('content')}
                  aria-invalid={!!errors.content}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-2">{errors.content.message}</p>
                )}
                <p className="text-xs text-[#6B7280] mt-2">
                  Supports plain text and markdown format. The content will be chunked and indexed
                  for RAG retrieval.
                </p>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-[#D1D9E6] rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      accept=".pdf,.md,.docx,.doc,.txt,.rtf"
                      onChange={handleFileChange}
                      className="max-w-md mx-auto"
                    />
                    {file && (
                      <div className="mt-4 p-3 bg-[#E0E5EC] rounded-lg inline-block">
                        <p className="text-sm text-[#3D4852] font-medium">Selected: {file.name}</p>
                        <p className="text-xs text-[#6B7280] mt-1">
                          Size: {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Supported formats: PDF, Markdown (.md), Word (.docx, .doc), Text (.txt), Rich
                    Text (.rtf)
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Text will be automatically extracted from the file when you submit the form.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
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
            <Button type="submit" variant="primary" disabled={isSubmitting || isExtracting}>
              {isSubmitting || isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isExtracting ? 'Extracting text...' : isEditing ? 'Updating...' : 'Creating...'}
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
