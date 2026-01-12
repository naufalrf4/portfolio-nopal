import { User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function AboutLoading() {
  return (
    <PageWrapper>
      <PageHeader
        title="About Me"
        description="Manage your personal information, bio, skills, experience, and social links"
        icon={<User />}
      />

      <div className="mt-6">
        {/* Tabs skeleton */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['Personal Info', 'Bio', 'Skills', 'Experience', 'Social Links'].map((tab) => (
            <div
              key={tab}
              className="h-10 px-4 rounded-2xl animate-pulse"
              style={{
                background: '#E0E5EC',
                boxShadow:
                  'inset 3px 3px 6px rgb(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5)',
              }}
            >
              <div className="h-full flex items-center">
                <div
                  className="h-4 w-20 rounded"
                  style={{
                    background: '#A0AEC0',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Content card skeleton */}
        <div
          className="rounded-[32px] p-8 animate-pulse"
          style={{
            background: '#E0E5EC',
            boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
          }}
        >
          <div className="space-y-6">
            {/* Title skeleton */}
            <div
              className="h-6 w-48 rounded"
              style={{
                background: '#A0AEC0',
              }}
            />

            {/* Form fields skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div
                  className="h-4 w-24 rounded"
                  style={{
                    background: '#A0AEC0',
                  }}
                />
                <div
                  className="h-12 w-full rounded-2xl"
                  style={{
                    background: '#E0E5EC',
                    boxShadow:
                      'inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
                  }}
                />
              </div>
            ))}

            {/* Button skeleton */}
            <div
              className="h-12 w-32 rounded-2xl"
              style={{
                background: '#6C63FF',
                boxShadow:
                  '6px 6px 12px rgba(108,99,255,0.4), -6px -6px 12px rgba(255,255,255,0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
