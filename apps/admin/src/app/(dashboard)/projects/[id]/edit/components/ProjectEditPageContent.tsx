'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { useProjectEdit, useProjectImages, ImageTab, ContentTab } from '@/features/projects/edit';

interface ProjectEditPageContentProps {
  projectId: string;
}

export function ProjectEditPageContent({ projectId }: ProjectEditPageContentProps) {
  const [activeTab, setActiveTab] = useState('images');
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const { project, loading, content, setContent, saving, debouncedContent, fetchProject } =
    useProjectEdit(projectId);
  const { images, fetchImages, handleImageUpload } = useProjectImages(projectId);

  useEffect(() => {
    if (project?.id) {
      void fetchImages();
    }
  }, [fetchImages, project?.id]);

  if (loading)
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      </PageWrapper>
    );

  if (!project) return null;

  return (
    <PageWrapper>
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <PageHeader
        title={`Editing: ${project.title}`}
        description="Manage images and content for this project"
      />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <button
              onClick={() => setIsMetadataModalOpen(true)}
              className="p-2 rounded-xl bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6] shadow-[6px_6px_12px_rgba(163,177,198,0.4),-6px_-6px_12px_rgba(255,255,255,0.4)] hover:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] transition-all"
              title="Edit Metadata"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <TabsContent value="images">
            <ImageTab
              projectId={project.id}
              images={images}
              onImageUpload={handleImageUpload}
              onUpdate={fetchImages}
            />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab
              content={content}
              onContentChange={setContent}
              saving={saving}
              debouncedContent={debouncedContent}
              project={project}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProjectModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        onSuccess={() => {
          setIsMetadataModalOpen(false);
          fetchProject();
        }}
        project={project}
      />
    </PageWrapper>
  );
}
