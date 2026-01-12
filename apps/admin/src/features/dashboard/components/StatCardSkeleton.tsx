import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NEU_INSET_SHADOW } from '../constants';

export function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-5">
        <Skeleton
          className="w-14 h-14 rounded-2xl bg-[#D1D9E6]"
          style={{ boxShadow: NEU_INSET_SHADOW }}
        />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-24 rounded-lg bg-[#D1D9E6]" />
          <Skeleton className="h-8 w-16 rounded-lg bg-[#D1D9E6]" />
          <div className="flex gap-4">
            <Skeleton className="h-3 w-20 rounded-lg bg-[#D1D9E6]" />
            <Skeleton className="h-3 w-20 rounded-lg bg-[#D1D9E6]" />
          </div>
        </div>
      </div>
    </Card>
  );
}
