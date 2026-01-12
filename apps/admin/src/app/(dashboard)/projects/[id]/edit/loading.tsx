export function ProjectEditLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center mb-6">
        <div className="h-10 w-40 bg-[#E0E5EC] rounded-2xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] animate-pulse" />
      </div>

      <div className="rounded-[32px] bg-[#E0E5EC] p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] animate-pulse">
        <div className="h-8 bg-[#E0E5EC] rounded-2xl w-96 mb-4 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />
        <div className="h-5 bg-[#E0E5EC] rounded-2xl w-72 mb-8 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-[#E0E5EC] rounded-xl shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]"
              />
            ))}
          </div>
          <div className="h-10 w-10 bg-[#E0E5EC] rounded-xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[#E0E5EC] p-4 h-48 shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]"
              />
            ))}
          </div>

          <div className="h-96 bg-[#E0E5EC] rounded-2xl shadow-[inset_10px_10px_20px_rgb(163,177,198,0.7),inset_-10px_-10px_20px_rgba(255,255,255,0.6)]" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return <ProjectEditLoading />;
}
