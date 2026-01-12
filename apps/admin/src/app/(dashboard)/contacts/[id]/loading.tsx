import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import Link from 'next/link';

export default function ContactDetailLoading() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <Link href="/contacts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header card skeleton */}
        <div
          className="rounded-[32px] p-6 animate-pulse"
          style={{
            background: '#E0E5EC',
            boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div
                className="h-6 w-48 rounded"
                style={{
                  background: '#A0AEC0',
                }}
              />
              <div
                className="h-4 w-64 rounded"
                style={{
                  background: '#CBD5E0',
                }}
              />
            </div>
            <div
              className="h-8 w-20 rounded-2xl"
              style={{
                background: '#CBD5E0',
              }}
            />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded"
                  style={{
                    background: '#A0AEC0',
                  }}
                />
                <div
                  className="h-4 w-40 rounded"
                  style={{
                    background: '#CBD5E0',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Message card skeleton */}
        <div
          className="rounded-[32px] p-6 animate-pulse"
          style={{
            background: '#E0E5EC',
            boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
          }}
        >
          <div
            className="h-6 w-32 rounded mb-4"
            style={{
              background: '#A0AEC0',
            }}
          />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 rounded"
                style={{
                  background: '#CBD5E0',
                  width: i === 5 ? '60%' : '100%',
                }}
              />
            ))}
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 w-32 rounded-2xl"
              style={{
                background: '#6C63FF',
                boxShadow:
                  '6px 6px 12px rgba(108,99,255,0.4), -6px -6px 12px rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
