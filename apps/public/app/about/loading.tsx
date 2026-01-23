import { Section, NeuCard } from '@/src/features/shared/components';

const insetShadow =
  'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]';

export default function AboutLoading() {
  return (
    <div className="py-8 md:py-16">
      <Section>
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 space-y-6">
              <NeuCard className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#E0E5EC] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-6 animate-pulse" />
                  <div className="w-48 h-8 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-2 animate-pulse" />
                  <div className="w-32 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
                  <div className="space-y-2 mb-6 w-full">
                    <div className="w-40 h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mx-auto animate-pulse" />
                    <div className="w-48 h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mx-auto animate-pulse" />
                  </div>
                  <div className="flex gap-3 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-11 h-11 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="w-36 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
              </NeuCard>

              <NeuCard className="p-6 md:p-8">
                <div className="w-24 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  <div className="w-full h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  <div className="w-3/4 h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
              </NeuCard>

              <NeuCard className="p-6 md:p-8">
                <div className="w-40 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-6 animate-pulse" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="w-20 h-8 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse"
                    />
                  ))}
                </div>
              </NeuCard>
            </div>

            <div className="lg:col-span-7">
              <div
                className={`w-56 h-6 bg-[#E0E5EC] rounded-xl ${insetShadow} mb-6 animate-pulse`}
              />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <NeuCard
                    key={i}
                    className="p-6 stagger-item"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-[#E0E5EC] ${insetShadow} animate-pulse shrink-0`}
                      />
                      <div className="flex-1 space-y-2">
                        <div
                          className={`w-3/4 h-5 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                        />
                        <div
                          className={`w-1/2 h-4 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                        />
                        <div
                          className={`w-full h-4 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                        />
                      </div>
                    </div>
                  </NeuCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
