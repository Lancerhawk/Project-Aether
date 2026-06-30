'use client';

import { TaskStatus, Priority, EnergyLevel } from '@/types/enums';
import { TaskFilters as TaskFiltersType } from '@/types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
  isOpen: boolean;
}

const selectClass = 'bg-[#0c0c0f] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-sm text-[#eeeef0] focus:outline-none focus:border-[#6366f1] transition-colors appearance-none';
const labelClass = 'text-[12px] font-medium text-[#5a5a66] uppercase tracking-wider';

export function TaskFilters({ filters, onChange, isOpen }: TaskFiltersProps) {
  if (!isOpen) return null;

  function handleChange(key: string, value: string) {
    onChange({ ...filters, [key]: value || undefined, page: 1 });
  }

  const activeCount = [filters.status, filters.priority, filters.energyLevel, filters.sortBy].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-end gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#0c0c0f]/50">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Status</label>
        <select value={filters.status || ''} onChange={(e) => handleChange('status', e.target.value)} className={selectClass}>
          <option value="">All</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Priority</label>
        <select value={filters.priority || ''} onChange={(e) => handleChange('priority', e.target.value)} className={selectClass}>
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Energy</label>
        <select value={filters.energyLevel || ''} onChange={(e) => handleChange('energyLevel', e.target.value)} className={selectClass}>
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Sort By</label>
        <select value={filters.sortBy || 'sortOrder'} onChange={(e) => handleChange('sortBy', e.target.value)} className={selectClass}>
          <option value="sortOrder">Manual</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Created</option>
          <option value="updatedAt">Updated</option>
          <option value="title">Alphabetical</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>Order</label>
        <select value={filters.sortOrder || 'asc'} onChange={(e) => handleChange('sortOrder', e.target.value)} className={selectClass}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => onChange({ page: 1, pageSize: filters.pageSize })}
          className="px-3 py-1.5 text-sm text-[#f43f5e] hover:text-[#e11d48] transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
