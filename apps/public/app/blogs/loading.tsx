import { Section } from '@/src/features/shared/components';

export default function BlogsLoading() {
  return (
    <div className="min-h-screen p-8">
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="w-48 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
          </div>

          <div className="mb-8 flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-24 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#E0E5EC] rounded-2xl p-6 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)] space-y-4"
              >
                <div className="w-full h-48 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="w-20 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  <div className="w-24 h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
                <div className="w-3/4 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  <div className="w-5/6 h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
