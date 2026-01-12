import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="neu-card max-w-md text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="inline-flex neu-extruded px-6 py-3 rounded-2xl font-medium text-foreground hover:neu-extruded-hover transition-all"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}
