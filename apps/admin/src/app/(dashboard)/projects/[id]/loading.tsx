export function ProjectDetailLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-[var(--radius-container)] bg-[var(--bg-elevated)] p-8 shadow-neu-extruded animate-pulse">
        <div className="h-8 bg-[var(--bg-elevated)] rounded-2xl w-64 mb-6 shadow-neu-extruded" />

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-[var(--bg-elevated)] rounded-xl w-32 shadow-neu-extruded" />
              <div className="h-12 bg-[var(--bg-elevated)] rounded-2xl w-full shadow-neu-extruded" />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-32 bg-[var(--bg-elevated)] rounded-2xl shadow-neu-extruded-sm"
            />
          ))}
        </div>
      </div>

      <div className="rounded-[var(--radius-container)] bg-[var(--bg-elevated)] p-8 shadow-neu-extruded animate-pulse">
        <div className="h-7 bg-[var(--bg-elevated)] rounded-2xl w-48 mb-6 shadow-neu-extruded" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-[var(--bg-elevated)] rounded-2xl shadow-neu-extruded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return <ProjectDetailLoading />;
}
