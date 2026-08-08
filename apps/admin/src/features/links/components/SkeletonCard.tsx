import { NEUMORPHIC_STYLES } from '../constants/links.constants';

interface SkeletonCardProps {
  index: number;
}

export function SkeletonCard({ index }: SkeletonCardProps) {
  return (
    <div
      className="h-48 rounded-[var(--radius-container)] animate-pulse"
      style={{
        backgroundColor: NEUMORPHIC_STYLES.background,
        boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
        animationDelay: `${index * 100}ms`,
      }}
    />
  );
}
