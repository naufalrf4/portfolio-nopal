'use client';

import Link from 'next/link';
import { Section, NeuButton } from '@/src/features/shared/components';
import { ErrorState } from '@/src/features/shared/components/ErrorState';
import { ArrowLeft } from 'lucide-react';

export default function ProjectDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-8 md:py-16">
      <Section>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#3B82F6] transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>

        <ErrorState
          title="Failed to load project"
          message="We couldn't load this project. Please try again or go back to the projects page."
          onRetry={reset}
          showRetry={true}
        />

        <div className="flex justify-center mt-6">
          <Link href="/projects">
            <NeuButton variant="default">View All Projects</NeuButton>
          </Link>
        </div>
      </Section>
    </div>
  );
}
