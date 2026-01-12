export function HeroSkeleton() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full shadow-[12px_12px_24px_rgba(163,177,198,0.6),-12px_-12px_24px_rgba(255,255,255,0.5)] p-2 bg-[#E0E5EC]">
            <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] bg-gradient-to-br from-[#D1D5DB] to-[#E5E7EB] animate-pulse" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="h-12 md:h-14 lg:h-16 bg-gradient-to-r from-[#D1D5DB] via-[#E5E7EB] to-[#D1D5DB] rounded-2xl max-w-md mx-auto animate-pulse shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]" />
        </div>

        <div className="h-10 md:h-12 lg:h-14 flex items-center justify-center mb-6">
          <div className="h-8 md:h-10 bg-gradient-to-r from-[#BFDBFE] via-[#DBEAFE] to-[#BFDBFE] rounded-xl w-64 md:w-80 animate-pulse shadow-[inset_2px_2px_4px_rgba(147,197,253,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]" />
        </div>

        <div className="space-y-3 mb-8 max-w-2xl mx-auto">
          <div className="h-6 md:h-7 bg-gradient-to-r from-[#D1D5DB] via-[#E5E7EB] to-[#D1D5DB] rounded-xl animate-pulse shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.3)]" />
          <div className="h-6 md:h-7 bg-gradient-to-r from-[#D1D5DB] via-[#E5E7EB] to-[#D1D5DB] rounded-xl animate-pulse shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.3)] w-5/6 mx-auto" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D1D5DB] to-[#E5E7EB] animate-pulse shadow-[4px_4px_8px_rgba(163,177,198,0.6),-4px_-4px_8px_rgba(255,255,255,0.5)]"
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="h-12 w-40 rounded-2xl bg-gradient-to-r from-[#BFDBFE] via-[#DBEAFE] to-[#BFDBFE] animate-pulse shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]" />
          <div className="h-12 w-44 rounded-2xl bg-gradient-to-r from-[#D1D5DB] via-[#E5E7EB] to-[#D1D5DB] animate-pulse shadow-[6px_6px_12px_rgba(163,177,198,0.6),-6px_-6px_12px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    </section>
  );
}
