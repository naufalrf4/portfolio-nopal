import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="neu-card max-w-lg text-center">
        <div className="mb-6">
          <div className="inline-flex p-4 rounded-full neu-inset mb-4">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The project you&apos;re looking for doesn&apos;t exist or has been removed. It might have
          been moved to a different location.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 neu-extruded px-6 py-3 rounded-2xl 
              font-medium text-foreground hover:neu-extruded-hover transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl 
              font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
