import { ArrowLeft, Calendar } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookingDetailLoading() {
  return (
    <PageWrapper>
      <div className="mb-6">
        <button className="inline-flex items-center gap-2 text-[#6B7280] mb-4 cursor-not-allowed opacity-50">
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#3D4852] mb-2">Booking Details</h1>
            <p className="text-[#6B7280]">View and manage booking information</p>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 rounded-[32px] p-8 bg-[#E0E5EC]"
          style={{
            boxShadow:
              '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div
              className="p-4 rounded-2xl bg-[#E0E5EC]"
              style={{
                boxShadow:
                  '6px 6px 12px rgba(163,177,198,0.5), -6px -6px 12px rgba(255,255,255,0.5)',
              }}
            >
              <Calendar className="h-8 w-8 text-[#3B82F6]" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-2xl bg-[#E0E5EC]"
                      style={{
                        boxShadow:
                          'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                      }}
                    >
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
                Appointment Details
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="p-3 rounded-2xl bg-[#E0E5EC]"
                      style={{
                        boxShadow:
                          'inset 4px 4px 8px rgba(163,177,198,0.5), inset -4px -4px 8px rgba(255,255,255,0.5)',
                      }}
                    >
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-[32px] p-8 bg-[#E0E5EC] h-fit"
          style={{
            boxShadow:
              '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
          }}
        >
          <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">
            Booking Metadata
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[#A3B1C6]/20">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
