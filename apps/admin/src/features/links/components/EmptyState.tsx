import { Button } from '@/components/ui/button';
import { Link2, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  searchQuery: string;
  onCreateClick: () => void;
}

export function EmptyState({ hasSearchQuery, searchQuery, onCreateClick }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 rounded-[32px] bg-[#E0E5EC]"
      style={{
        boxShadow: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
      }}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          boxShadow:
            'inset 10px 10px 20px rgba(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)',
        }}
      >
        <Link2 className="h-10 w-10 text-[#6B7280]" />
      </div>
      <h3 className="font-display text-xl font-bold text-[#3D4852] mb-2">
        {hasSearchQuery ? 'No links found' : 'No profile links yet'}
      </h3>
      <p className="text-[#6B7280] mb-6 text-center max-w-md">
        {hasSearchQuery
          ? 'Try adjusting your search or filter criteria'
          : 'Create your first link to connect your social profiles'}
      </p>
      {!hasSearchQuery && (
        <Button variant="primary" onClick={onCreateClick} className="gap-2">
          <Plus className="h-5 w-5" />
          Add Link
        </Button>
      )}
    </div>
  );
}
