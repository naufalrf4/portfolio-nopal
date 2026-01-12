import { Eye, EyeOff } from 'lucide-react';
import type { FilterMode } from '../types/links.types';

interface FilterButtonsProps {
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  stats: {
    total: number;
    visible: number;
    hidden: number;
  };
}

export function FilterButtons({ filterMode, onFilterChange, stats }: FilterButtonsProps) {
  return (
    <div
      className="flex flex-wrap gap-3 p-4 rounded-2xl bg-[#E0E5EC]"
      style={{
        boxShadow:
          'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
      }}
    >
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          filterMode === 'all'
            ? 'bg-[#E0E5EC] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] text-[#3B82F6]'
            : 'text-[#6B7280] hover:text-[#3D4852]'
        }`}
      >
        All ({stats.total})
      </button>
      <button
        onClick={() => onFilterChange('visible')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          filterMode === 'visible'
            ? 'bg-[#E0E5EC] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] text-[#38B2AC]'
            : 'text-[#6B7280] hover:text-[#3D4852]'
        }`}
      >
        <Eye className="h-4 w-4" />
        Visible ({stats.visible})
      </button>
      <button
        onClick={() => onFilterChange('hidden')}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
          filterMode === 'hidden'
            ? 'bg-[#E0E5EC] shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.5)] text-[#6B7280]'
            : 'text-[#6B7280] hover:text-[#3D4852]'
        }`}
      >
        <EyeOff className="h-4 w-4" />
        Hidden ({stats.hidden})
      </button>
    </div>
  );
}
