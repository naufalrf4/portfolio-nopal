import { Section } from '@/src/features/shared/components';
import { LoadingState } from '@/src/features/shared/components/LoadingState';

export default function ProjectDetailLoading() {
  return (
    <div className="py-8 md:py-16">
      <Section>
        <div className="mb-8">
          <LoadingState type="skeleton" count={1} height="h-6" width="w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-10">
            <LoadingState type="skeleton" count={1} height="h-[400px]" width="w-full" />

            <div className="space-y-4">
              <LoadingState type="skeleton" count={1} height="h-12" width="w-3/4" />
              <LoadingState type="skeleton" count={2} height="h-6" width="w-full" />
            </div>

            <LoadingState type="skeleton" count={4} height="h-32" width="w-full" />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <LoadingState type="skeleton" count={1} height="h-64" width="w-full" />
              <LoadingState type="skeleton" count={2} height="h-12" width="w-full" />
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}
