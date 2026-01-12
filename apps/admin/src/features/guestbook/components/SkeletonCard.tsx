import { NEUMORPHIC_STYLES } from '../constants/guestbook.constants';

interface SkeletonCardProps {
  index: number;
}

export function SkeletonCard({ index }: SkeletonCardProps) {
  return (
    <div
      className="rounded-[32px] p-6 animate-pulse"
      style={{
        background: NEUMORPHIC_STYLES.background,
        boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-full flex-shrink-0"
          style={{
            background: NEUMORPHIC_STYLES.background,
            boxShadow: NEUMORPHIC_STYLES.shadows.inset,
          }}
        />
        <div className="flex-1 space-y-3">
          <div
            className="h-4 rounded-full w-32"
            style={{
              background: NEUMORPHIC_STYLES.background,
              boxShadow: NEUMORPHIC_STYLES.shadows.inset,
            }}
          />
          <div
            className="h-3 rounded-full w-full"
            style={{
              background: NEUMORPHIC_STYLES.background,
              boxShadow: NEUMORPHIC_STYLES.shadows.inset,
            }}
          />
          <div
            className="h-3 rounded-full w-3/4"
            style={{
              background: NEUMORPHIC_STYLES.background,
              boxShadow: NEUMORPHIC_STYLES.shadows.inset,
            }}
          />
        </div>
      </div>
    </div>
  );
}
