export function ProjectsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-[32px] bg-[#E0E5EC] p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] animate-pulse">
        <div className="h-8 bg-[#E0E5EC] rounded-2xl w-48 mb-4 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />
        <div className="h-4 bg-[#E0E5EC] rounded-2xl w-64 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-[#E0E5EC] rounded-2xl shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <div className="h-12 bg-[#E0E5EC] rounded-2xl w-64 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] animate-pulse" />
        <div className="flex gap-2 ml-auto">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-24 bg-[#E0E5EC] rounded-2xl shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)] animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-[32px] bg-[#E0E5EC] p-8 shadow-[9px_9px_16px_rgb(163,177,198,0.6),-9px_-9px_16px_rgba(255,255,255,0.5)] animate-pulse"
          >
            <div className="h-48 bg-[#E0E5EC] rounded-2xl mb-6 shadow-[inset_6px_6px_10px_rgb(163,177,198,0.6),inset_-6px_-6px_10px_rgba(255,255,255,0.5)]" />
            <div className="h-6 bg-[#E0E5EC] rounded-2xl w-3/4 mb-3 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />
            <div className="h-4 bg-[#E0E5EC] rounded-2xl w-full mb-2 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />
            <div className="h-4 bg-[#E0E5EC] rounded-2xl w-5/6 shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]" />

            <div className="flex gap-2 mt-6">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-8 w-20 bg-[#E0E5EC] rounded-xl shadow-[inset_3px_3px_6px_rgb(163,177,198,0.6),inset_-3px_-3px_6px_rgba(255,255,255,0.5)]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return <ProjectsLoading />;
}
