import { Eye, EyeOff, Star, Grid3x3, List, Search } from './Icons';
import { Input } from '@/components/ui/input';
import type { FilterMode, ViewMode } from '../types/projects.types';

interface ProjectFiltersProps {
  filterMode: FilterMode;
  setFilterMode: (mode: FilterMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const filterButtons = [
  { mode: 'all' as const, label: 'All', icon: null },
  { mode: 'visible' as const, label: 'Visible', icon: Eye },
  { mode: 'hidden' as const, label: 'Hidden', icon: EyeOff },
  { mode: 'featured' as const, label: 'Featured', icon: Star },
];

export function ProjectFilters({
  filterMode,
  setFilterMode,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
}: ProjectFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                filterMode === mode
                  ? 'bg-[#3B82F6] text-white shadow-[6px_6px_12px_rgba(59,130,246,0.4),-6px_-6px_12px_rgba(59,130,246,0.1)]'
                  : 'bg-[#E0E5EC] text-[#3D4852] shadow-[6px_6px_12px_rgba(163,177,198,0.4),-6px_-6px_12px_rgba(255,255,255,0.4)] hover:shadow-[inset_6px_6px_12px_rgba(163,177,198,0.4),inset_-6px_-6px_12px_rgba(255,255,255,0.4)]'
              }`}
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${
              viewMode === 'grid'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6]'
            }`}
            style={{
              boxShadow:
                viewMode === 'grid'
                  ? '6px 6px 12px rgba(59,130,246,0.4), -6px -6px 12px rgba(59,130,246,0.1)'
                  : '6px 6px 12px rgba(163,177,198,0.4), -6px -6px 12px rgba(255,255,255,0.4)',
            }}
          >
            <Grid3x3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl transition-all ${
              viewMode === 'table'
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#E0E5EC] text-[#6B7280] hover:text-[#3B82F6]'
            }`}
            style={{
              boxShadow:
                viewMode === 'table'
                  ? '6px 6px 12px rgba(59,130,246,0.4), -6px -6px 12px rgba(59,130,246,0.1)'
                  : '6px 6px 12px rgba(163,177,198,0.4), -6px -6px 12px rgba(255,255,255,0.4)',
            }}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>
    </div>
  );
}
