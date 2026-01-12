export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="neu-card w-32 h-12 animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="neu-card h-[400px] animate-pulse">
            <div className="w-full h-48 mb-4 rounded-2xl neu-inset" />
            <div className="h-6 neu-inset rounded-lg mb-3 w-3/4" />
            <div className="h-4 neu-inset rounded-lg mb-4 w-full" />
            <div className="flex gap-2 mb-4">
              <div className="h-6 neu-inset rounded-lg w-20" />
              <div className="h-6 neu-inset rounded-lg w-20" />
              <div className="h-6 neu-inset rounded-lg w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
