import { Send } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function ContactsLoading() {
  return (
    <PageWrapper>
      <PageHeader
        title="Contact Management"
        description="Manage contact form submissions and settings"
        icon={<Send />}
      />

      <div className="mt-6 space-y-6">
        {/* Tabs skeleton */}
        <div className="flex gap-2 flex-wrap">
          {['Submissions', 'Settings'].map((tab) => (
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

        {/* Table/Card skeleton */}
        <div
          className="rounded-[32px] p-6 animate-pulse"
          style={{
            background: '#E0E5EC',
            boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
          }}
        >
          <div className="space-y-4">
            {/* Table header skeleton */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-[#CBD5E0]">
              {['Name', 'Email', 'Subject', 'Date'].map((col) => (
                <div
                  key={col}
                  className="h-4 rounded"
                  style={{
                    background: '#A0AEC0',
                  }}
                />
              ))}
            </div>

            {/* Table rows skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 py-4">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="h-4 rounded"
                    style={{
                      background: '#CBD5E0',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center">
          <div
            className="h-4 w-32 rounded"
            style={{
              background: '#A0AEC0',
            }}
          />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-2xl"
                style={{
                  background: '#E0E5EC',
                  boxShadow:
                    '6px 6px 12px rgb(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
