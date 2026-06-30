'use client';

import { TaskFilters as TaskFiltersType } from '@/types/task';
import { TaskSearch } from './TaskSearch';

interface TaskToolbarProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  onNewTask: () => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  totalItems: number;
}

export function TaskToolbar({
  filters,
  onFiltersChange,
  onNewTask,
  filtersOpen,
  onToggleFilters,
  totalItems,
}: TaskToolbarProps) {
  function handleSearchChange(search: string) {
    onFiltersChange({ ...filters, search: search || undefined, page: 1 });
  }

  const activeFilterCount = [filters.status, filters.priority, filters.energyLevel].filter(Boolean).length;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex-1 w-full sm:max-w-sm">
        <TaskSearch value={filters.search || ''} onChange={handleSearchChange} />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] text-[#5a5a66] tabular-nums">{totalItems} tasks</span>

        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            filtersOpen || activeFilterCount > 0
              ? 'border-[#6366f1] text-[#818cf8] bg-[rgba(99,102,241,0.08)]'
              : 'border-[rgba(255,255,255,0.06)] text-[#94949e] hover:text-[#eeeef0] hover:border-[rgba(255,255,255,0.12)]'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#6366f1] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-[#6366f1] hover:bg-[#818cf8] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Task
        </button>
      </div>
    </div>
  );
}
