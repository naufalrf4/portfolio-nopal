'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';

export default function BookingDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Booking detail error:', error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="mb-6">
        <button
          onClick={() => router.push('/bookings')}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#3B82F6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </button>
      </div>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="max-w-md w-full rounded-[32px] p-8 bg-[#E0E5EC] text-center"
          style={{
            boxShadow:
              '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
          }}
        >
          <div
            className="inline-flex p-4 rounded-2xl bg-[#E0E5EC] mb-4"
            style={{
              boxShadow: '6px 6px 12px rgba(163,177,198,0.5), -6px -6px 12px rgba(255,255,255,0.5)',
            }}
          >
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#3D4852] mb-2">Unable to Load Booking</h2>
          <p className="text-[#6B7280] mb-6">
            We encountered an error while loading this booking. The booking may not exist or there
            was a problem connecting to the server.
          </p>
          {error.digest && (
            <p className="text-xs text-[#9CA3AF] mb-6 font-mono">Error ID: {error.digest}</p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/bookings')} className="flex-1">
              Back to List
            </Button>
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
