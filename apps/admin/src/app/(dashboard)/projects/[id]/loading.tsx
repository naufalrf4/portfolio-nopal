export function ProjectDetailLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-[32px] bg-[#E0E5EC] p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] animate-pulse">
        <div className="h-8 bg-[#E0E5EC] rounded-2xl w-64 mb-6 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-[#E0E5EC] rounded-xl w-32 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />
              <div className="h-12 bg-[#E0E5EC] rounded-2xl w-full shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]" />
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-32 bg-[#E0E5EC] rounded-2xl shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)]"
            />
          ))}
        </div>
      </div>

      <div className="rounded-[32px] bg-[#E0E5EC] p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] animate-pulse">
        <div className="h-7 bg-[#E0E5EC] rounded-2xl w-48 mb-6 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-[#E0E5EC] rounded-2xl shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]"
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
