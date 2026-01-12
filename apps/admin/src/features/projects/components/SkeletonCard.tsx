import { NEUMORPHIC_STYLES } from '../constants/projects.constants';

export function SkeletonCard() {
  return (
    <div
      className="rounded-[32px] p-6 bg-[#E0E5EC] animate-pulse"
      style={{
        boxShadow: NEUMORPHIC_STYLES.shadows.extruded,
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl bg-[#E0E5EC] mb-4"
        style={{
          boxShadow: NEUMORPHIC_STYLES.shadows.button,
        }}
      />
      <div className="h-6 bg-[#D1D5DB] rounded-lg mb-2" />
      <div className="h-4 bg-[#D1D5DB] rounded-lg mb-4 w-2/3" />
      <div className="h-16 bg-[#D1D5DB] rounded-lg mb-4" />
      <div className="flex gap-2">
        <div className="h-8 bg-[#D1D5DB] rounded-full w-16" />
        <div className="h-8 bg-[#D1D5DB] rounded-full w-16" />
        <div className="h-8 bg-[#D1D5DB] rounded-full w-16" />
      </div>
    </div>
  );
}
