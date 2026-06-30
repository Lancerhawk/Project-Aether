'use client';

import { useState, useEffect, useRef } from 'react';
import { Task } from '@/types/task';
import { TaskForm } from '@/components/forms/TaskForm';
import { SubTaskList } from '@/components/data-display/SubTaskList';
import { PriorityBadge } from '@/components/data-display/PriorityBadge';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { EnergyBadge } from '@/components/data-display/EnergyBadge';
import { useUpdateTask } from '@/hooks/useUpdateTask';
import { useCreateTask } from '@/hooks/useCreateTask';
import { useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';
import { UpdateTaskInput, CreateTaskInput } from '@/types/task';

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  isEditing: boolean;
  isProcessing?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export function TaskDrawer({
  task,
  isOpen,
  isEditing,
  isProcessing,
  onClose,
  onEdit,
  onCancelEdit,
  onDuplicate,
  onDelete,
  onArchive,
}: TaskDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const updateTask = useUpdateTask();
  const createTask = useCreateTask();
  const queryClient = useQueryClient();

  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(task?.status || null);

  useEffect(() => {
    setOptimisticStatus(task?.status || null);
  }, [task?.status]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Removed early return for isOpen to allow transitions
  // We must always render the wrapper so CSS transitions can play!

  const tags = task ? task.taskTags.map((tt) => tt.tag) : [];
  const dueDate = task?.dueDate ? new Date(task.dueDate) : null;

  async function handleSubmit(data: UpdateTaskInput | CreateTaskInput) {
    if (task) {
      await updateTask.mutateAsync({ id: task.id, data: data as UpdateTaskInput });
    } else {
      await createTask.mutateAsync(data as CreateTaskInput);
    }
    onCancelEdit();
  }

  function handleSubtaskUpdate() {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['task', task!.id] });
  }

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as any;
    setOptimisticStatus(newStatus);
    try {
      await taskService.updateStatus(task!.id, newStatus);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', task!.id] });
    } catch (error) {
      setOptimisticStatus(task!.status);
    }
  }

  const isLoading = isProcessing || updateTask.isPending || createTask.isPending;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-[#0c0c0f] border-l border-[rgba(255,255,255,0.06)] shadow-2xl overflow-y-auto transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0c0f]/50 backdrop-blur-[2px]">
            <div className="w-8 h-8 border-4 border-[rgba(255,255,255,0.1)] rounded-full absolute" />
            <div className="w-8 h-8 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin relative z-10" />
          </div>
        )}
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#0c0c0f]/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {task && (
              <>
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </>
            )}
            {!task && <span className="text-sm font-medium text-[#eeeef0]">Create Task</span>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5a5a66] hover:text-[#eeeef0] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            aria-label="Close drawer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {!task && !isEditing ? (
            <div className="text-center text-[#5a5a66] py-10">Select a task to view details</div>
          ) : isEditing ? (
            <TaskForm
              initialData={task || undefined}
              onSubmit={handleSubmit}
              onCancel={onCancelEdit}
              isSubmitting={updateTask.isPending || createTask.isPending}
            />
          ) : task ? (
            <>
              {/* Title */}
              <div>
                <h2 className="text-xl font-semibold text-[#eeeef0] mb-2">{task.title}</h2>
                {task.description && (
                  <p className="text-sm text-[#94949e] whitespace-pre-wrap">{task.description}</p>
                )}
              </div>

              {/* Quick Status Change */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#5a5a66]">Status</label>
                <select
                  value={optimisticStatus || task.status}
                  onChange={handleStatusChange}
                  className="bg-[#0c0c0f] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-sm text-[#eeeef0] focus:outline-none focus:border-[#6366f1] transition-colors"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-[12px] rounded-md font-medium"
                      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                {task.energyLevel && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#5a5a66] uppercase tracking-wider">Energy</span>
                    <EnergyBadge energy={task.energyLevel} />
                  </div>
                )}
                {task.estimatedMinutes && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#5a5a66] uppercase tracking-wider">Estimated</span>
                    <span className="text-sm text-[#eeeef0] tabular-nums">{task.estimatedMinutes} min</span>
                  </div>
                )}
                {dueDate && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#5a5a66] uppercase tracking-wider">Due Date</span>
                    <span className="text-sm text-[#eeeef0]">
                      {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {task.completedAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#5a5a66] uppercase tracking-wider">Completed</span>
                    <span className="text-sm text-[#34d399]">
                      {new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4">
                <SubTaskList taskId={task.id} subtasks={task.subtasks} onUpdate={handleSubtaskUpdate} />
              </div>

              {/* Timestamps */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 text-[12px] text-[#5a5a66] space-y-1">
                <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
              </div>

              {/* Actions */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 flex flex-wrap gap-2">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#818cf8] rounded-lg border border-[rgba(99,102,241,0.2)] hover:bg-[rgba(99,102,241,0.08)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => onDuplicate(task.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#94949e] rounded-lg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Duplicate
                </button>
                <button
                  onClick={() => onArchive(task.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#fbbf24] rounded-lg border border-[rgba(251,191,36,0.2)] hover:bg-[rgba(251,191,36,0.08)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 8v13H3V8" />
                    <path d="M1 3h22v5H1z" />
                  </svg>
                  Archive
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#f43f5e] rounded-lg border border-[rgba(244,63,94,0.2)] hover:bg-[rgba(244,63,94,0.08)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
