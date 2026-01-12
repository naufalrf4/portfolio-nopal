import { PageWrapper } from '@/components/layout/PageWrapper';

const NEUMORPHIC_SHADOWS = {
  extruded: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
  inset: 'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255, 0.5)',
};

export default function LinksLoading() {
  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div
            className="h-9 w-48 rounded-2xl animate-pulse"
            style={{
              backgroundColor: '#E0E5EC',
              boxShadow: NEUMORPHIC_SHADOWS.inset,
            }}
          />
          <div
            className="h-5 w-64 rounded-xl mt-2 animate-pulse"
            style={{
              backgroundColor: '#E0E5EC',
              boxShadow: NEUMORPHIC_SHADOWS.inset,
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-[32px] p-6"
            style={{
              backgroundColor: '#E0E5EC',
              boxShadow: NEUMORPHIC_SHADOWS.extruded,
            }}
          >
            <div className="space-y-4">
              <div
                className="h-12 w-12 rounded-xl animate-pulse mx-auto"
                style={{
                  backgroundColor: '#D1D9E6',
                  boxShadow: NEUMORPHIC_SHADOWS.inset,
                }}
              />
              <div
                className="h-5 w-3/4 rounded-xl animate-pulse mx-auto"
                style={{
                  backgroundColor: '#D1D9E6',
                  boxShadow: NEUMORPHIC_SHADOWS.inset,
                }}
              />
              <div
                className="h-4 w-full rounded-xl animate-pulse"
                style={{
                  backgroundColor: '#D1D9E6',
                  boxShadow: NEUMORPHIC_SHADOWS.inset,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
