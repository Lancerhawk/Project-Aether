'use client';

import { useState, useEffect } from 'react';
import { taskService } from '@/services/task.service';
import { Task, PaginationMeta } from '@/types/task';
import { TaskCard } from '@/components/data-display/TaskCard';
import { TaskRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

export default function TrashPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, pageSize: 20, totalItems: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    taskId: string | null;
  }>({ isOpen: false, taskId: null });

  async function loadTrash(page = 1) {
    setIsLoading(true);
    try {
      const res = await taskService.listDeleted(page);
      setTasks(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error('Failed to load trash', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrash();
  }, []);

  async function handleRestore(id: string) {
    try {
      await taskService.restore(id);
      await loadTrash(pagination.page);
    } catch (error) {
      console.error('Failed to restore task', error);
    }
  }

  async function handlePermanentDelete() {
    if (!confirmDialog.taskId) return;
    try {
      await taskService.permanentDelete(confirmDialog.taskId);
      setConfirmDialog({ isOpen: false, taskId: null });
      await loadTrash(pagination.page);
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#050505]">
      {/* Header Area */}
      <div className="flex-shrink-0">
        <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <h1 className="text-2xl font-bold text-[#eeeef0]">Trash</h1>
          <p className="text-sm text-[#94949e] mt-1">Deleted tasks are kept here until permanently removed.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        {isLoading ? (
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <TaskRowSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6M8 6V4h8v2" />
              </svg>
            }
            title="Trash is empty"
            description="No deleted tasks found."
          />
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-[rgba(255,255,255,0.06)] text-[11px] font-medium text-[#5a5a66] uppercase tracking-wider">
              <span className="w-4 h-4 ml-8" /> {/* Checkbox spacer */}
              <span className="flex-1">Title</span>
              <span className="hidden lg:block w-32">Deleted At</span>
              <span className="w-48 text-right pr-4">Actions</span>
            </div>

            {/* Rows */}
            <div role="rowgroup">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] hover:bg-[#14141a]"
                >
                  <div className="w-4 h-4 ml-8 rounded border border-[rgba(255,255,255,0.12)] bg-[#14141a]" />
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-[#eeeef0] truncate block">{task.title}</span>
                  </div>

                  {task.deletedAt && (
                    <div className="hidden lg:block w-32 flex-shrink-0 text-[12px] text-[#5a5a66]">
                      {new Date(task.deletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}

                  <div className="flex-shrink-0 w-48 flex justify-end gap-2 pr-4">
                    <button
                      onClick={() => handleRestore(task.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#34d399] rounded-md border border-[rgba(52,211,153,0.2)] hover:bg-[rgba(52,211,153,0.1)] transition-colors"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => setConfirmDialog({ isOpen: true, taskId: task.id })}
                      className="px-3 py-1.5 text-xs font-medium text-[#f43f5e] rounded-md border border-[rgba(244,63,94,0.2)] hover:bg-[rgba(244,63,94,0.1)] transition-colors"
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
                <span className="text-sm text-[#5a5a66]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadTrash(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[rgba(255,255,255,0.06)] text-[#94949e] hover:text-[#eeeef0] hover:border-[rgba(255,255,255,0.12)] disabled:opacity-30 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => loadTrash(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[rgba(255,255,255,0.06)] text-[#94949e] hover:text-[#eeeef0] hover:border-[rgba(255,255,255,0.12)] disabled:opacity-30 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Permanently"
        description="Are you sure you want to permanently delete this task? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete Forever"
        onConfirm={handlePermanentDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, taskId: null })}
      />
    </div>
  );
}
