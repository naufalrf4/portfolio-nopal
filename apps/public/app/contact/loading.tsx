import { LoadingState, Section, NeuCard } from '@/src/features/shared/components';

export default function ContactLoading() {
  return (
    <div className="py-8 md:py-16">
      <Section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            <div className="lg:col-span-5">
              <NeuCard className="p-6 md:p-8">
                <div className="w-40 h-8 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-6 animate-pulse" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                    <div className="w-48 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                    <div className="w-56 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-32 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-11 h-11 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </NeuCard>
            </div>

            <div className="lg:col-span-7">
              <div className="flex gap-2 mb-6">
                <div className="flex-1 h-14 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                <div className="flex-1 h-14 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
              </div>

              <NeuCard className="p-6 md:p-8">
                <div className="space-y-6">
                  <div>
                    <div className="w-24 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-2 animate-pulse" />
                    <div className="w-full h-12 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  </div>
                  <div>
                    <div className="w-24 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-2 animate-pulse" />
                    <div className="w-full h-12 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  </div>
                  <div>
                    <div className="w-24 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-2 animate-pulse" />
                    <div className="w-full h-32 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  </div>
                  <div className="w-full h-12 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
              </NeuCard>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <div className="w-64 h-8 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-2 animate-pulse" />
              <div className="w-48 h-5 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
            </div>
            <LoadingState type="skeleton" count={4} height="h-20" />
          </div>
        </div>
      </Section>
    </div>
  );
}
