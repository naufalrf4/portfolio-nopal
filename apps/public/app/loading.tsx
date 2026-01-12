import { LoadingState } from '@/src/features/shared/components';

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-6">
          <LoadingState type="skeleton" count={1} height="h-32" />
        </div>
        <div className="space-y-6">
          <LoadingState type="skeleton" count={3} height="h-64" />
        </div>
      </div>
    </div>
  );
}
