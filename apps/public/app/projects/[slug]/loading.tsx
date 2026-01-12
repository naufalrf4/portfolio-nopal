import { Section, NeuCard } from '@/src/features/shared/components';

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen p-8">
      <Section>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
            <div className="w-3/4 h-12 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
            <div className="w-full h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-6 animate-pulse" />
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-7 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse"
                />
              ))}
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
              <div className="w-32 h-10 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
            </div>
          </div>

          <NeuCard className="mb-8">
            <div className="w-full h-96 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
          </NeuCard>

          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <NeuCard key={i}>
                <div className="w-32 h-6 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] mb-4 animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  <div className="w-full h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                  <div className="w-3/4 h-4 bg-[#E0E5EC] rounded-xl shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.4)] animate-pulse" />
                </div>
              </NeuCard>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
