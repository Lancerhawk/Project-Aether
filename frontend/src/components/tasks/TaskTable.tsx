'use client';

import { Task, PaginationMeta } from '@/types/task';
import { TaskCard } from '@/components/data-display/TaskCard';
import { TaskRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface TaskTableProps {
  tasks: Task[];
  pagination: PaginationMeta;
  isLoading: boolean;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onTaskClick: (task: Task) => void;
  onStatusToggle: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function TaskTable({
  tasks,
  pagination,
  isLoading,
  selectedIds,
  onSelect,
  onSelectAll,
  onTaskClick,
  onStatusToggle,
  onPageChange,
}: TaskTableProps) {
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedIds.has(t.id));

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <TaskRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        }
        title="No tasks found"
        description="Create your first task to get started, or adjust your filters."
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[rgba(255,255,255,0.06)] text-[11px] font-medium text-[#5a5a66] uppercase tracking-wider">
        <div
          onClick={onSelectAll}
          className={`flex-shrink-0 w-4 h-4 rounded border cursor-pointer transition-colors ${
            allSelected ? 'bg-[#6366f1] border-[#6366f1]' : 'border-[rgba(255,255,255,0.12)] hover:border-[#6366f1]'
          }`}
          role="checkbox"
          aria-checked={allSelected}
          aria-label="Select all tasks"
        >
          {allSelected && (
            <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
            </svg>
          )}
        </div>
        <span className="w-4.5" />
        <span className="flex-1">Title</span>
        <span className="hidden md:block w-24">Tags</span>
        <span className="hidden sm:block w-16">Priority</span>
        <span className="hidden sm:block w-20">Status</span>
        <span className="hidden lg:block w-16">Energy</span>
        <span className="hidden md:block w-16">Due</span>
        <span className="hidden lg:block w-10">Est.</span>
        <span className="hidden xl:block w-16">Updated</span>
      </div>

      {/* Rows */}
      <div role="rowgroup">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedIds.has(task.id)}
            isSelectionMode={selectedIds.size > 0}
            onSelect={onSelect}
            onClick={onTaskClick}
            onStatusToggle={onStatusToggle}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
          <span className="text-sm text-[#5a5a66]">
            Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[rgba(255,255,255,0.06)] text-[#94949e] hover:text-[#eeeef0] hover:border-[rgba(255,255,255,0.12)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[rgba(255,255,255,0.06)] text-[#94949e] hover:text-[#eeeef0] hover:border-[rgba(255,255,255,0.12)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
