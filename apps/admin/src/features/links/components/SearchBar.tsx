import { Input } from '@/components/ui/input';
import { Search, X, Grid3X3, List } from 'lucide-react';
import type { ViewMode } from '../types/links.types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SearchBar({ searchQuery, onSearchChange, viewMode, onViewModeChange }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
        <Input
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#3D4852]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div
        className="flex gap-1 p-1 rounded-xl bg-[#E0E5EC]"
        style={{
          boxShadow:
            'inset 3px 3px 6px rgba(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5)',
        }}
      >
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            viewMode === 'grid'
              ? 'bg-[#E0E5EC] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] text-[#3B82F6]'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          }`}
        >
          <Grid3X3 className="h-5 w-5" />
        </button>
        <button
          onClick={() => onViewModeChange('table')}
          className={`p-2.5 rounded-lg transition-all duration-200 ${
            viewMode === 'table'
              ? 'bg-[#E0E5EC] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] text-[#3B82F6]'
              : 'text-[#6B7280] hover:text-[#3D4852]'
          }`}
        >
          <List className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
