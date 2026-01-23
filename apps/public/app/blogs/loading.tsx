import { Section } from '@/src/features/shared/components';

const insetShadow =
  'shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)]';
const cardShadow =
  'shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.5)]';

export default function BlogsLoading() {
  return (
    <div className="min-h-screen p-8">
      <Section>
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="mb-12">
            <div
              className={`w-48 h-10 bg-[#E0E5EC] rounded-xl ${insetShadow} mb-4 animate-pulse`}
            />
            <div
              className={`w-full max-w-96 h-6 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
            />
          </div>

          <div className="mb-8 flex gap-4 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-24 h-10 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`bg-[#E0E5EC] rounded-2xl overflow-hidden ${cardShadow} stagger-item`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-full aspect-video bg-[#E0E5EC] ${insetShadow} animate-pulse`} />

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-20 h-5 bg-[#E0E5EC] rounded-full ${insetShadow} animate-pulse`}
                    />
                    <div
                      className={`w-24 h-4 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                    />
                  </div>

                  <div
                    className={`w-3/4 h-6 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                  />

                  <div className="space-y-2">
                    <div
                      className={`w-full h-4 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                    />
                    <div
                      className={`w-5/6 h-4 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      {[1, 2].map((j) => (
                        <div
                          key={j}
                          className={`w-14 h-5 bg-[#E0E5EC] rounded-full ${insetShadow} animate-pulse`}
                        />
                      ))}
                    </div>
                    <div
                      className={`w-24 h-5 bg-[#E0E5EC] rounded-xl ${insetShadow} animate-pulse`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
