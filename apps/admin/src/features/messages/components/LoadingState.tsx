import { SkeletonCard } from './SkeletonCard';

export function LoadingState() {
  return (
    <div className="grid gap-6">
      {[...Array(3)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
