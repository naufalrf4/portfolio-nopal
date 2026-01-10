import ProjectForm from '@/components/projects/ProjectForm';
import ContextManager from '@/components/projects/ContextManager';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <ProjectForm projectId={id} />
      <ContextManager projectId={id} />
    </div>
  );
}
