'use client';

import { useState, useRef, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCreateTask } from '@/hooks/useCreateTask';
import { useDeleteTask } from '@/hooks/useDeleteTask';
import { taskService } from '@/services/task.service';
import { TaskFilters as TaskFiltersType, Task, UpdateTaskInput, CreateTaskInput } from '@/types/task';
import { TaskToolbar } from '@/components/tasks/TaskToolbar';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskDrawer } from '@/components/tasks/TaskDrawer';
import { BulkActions } from '@/components/tasks/BulkActions';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { useQueryClient } from '@tanstack/react-query';

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFiltersType>({ page: 1, pageSize: 20 });
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDrawerProcessing, setIsDrawerProcessing] = useState(false);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'delete' | 'bulkDelete' | 'bulkArchive' | null;
    taskId?: string;
  }>({ isOpen: false, action: null });

  const { tasks, pagination, isLoading, refetch } = useTasks(filters);
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();

  const pendingUpdatesRef = useRef<Record<string, 'TODO' | 'COMPLETED'>>({});
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flushUpdates = async (isUnloading = false) => {
    const updates = { ...pendingUpdatesRef.current };
    pendingUpdatesRef.current = {};
    const toComplete: string[] = [];
    const toTodo: string[] = [];
    for (const [taskId, status] of Object.entries(updates)) {
      if (status === 'COMPLETED') toComplete.push(taskId);
      else toTodo.push(taskId);
    }
    
    if (toComplete.length === 0 && toTodo.length === 0) return;

    try {
      const promises = [];
      if (toComplete.length > 0) promises.push(taskService.bulkComplete(toComplete, { keepalive: isUnloading }));
      if (toTodo.length > 0) promises.push(taskService.bulkUpdate(toTodo, { status: 'TODO' }, { keepalive: isUnloading }));
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to save batched status updates', error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (Object.keys(pendingUpdatesRef.current).length > 0) {
        flushUpdates(true);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);
      if (Object.keys(pendingUpdatesRef.current).length > 0) {
        flushUpdates();
      }
    };
  }, []);

  // Sync active task with tasks list to update UI when subtasks change
  useEffect(() => {
    if (activeTask && tasks) {
      const updated = tasks.find(t => t.id === activeTask.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(activeTask)) {
        setActiveTask(updated);
      }
    }
  }, [tasks, activeTask]);

  // Selection
  function handleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function handleSelectAll() {
    if (selectedIds.size === tasks.length && tasks.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    }
  }

  // Drawer
  function handleTaskClick(task: Task) {
    setActiveTask(task);
    setIsEditing(false);
    setIsDrawerOpen(true);
  }

  function handleNewTask() {
    setActiveTask(null);
    setIsEditing(true);
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setActiveTask(null);
      setIsEditing(false);
    }, 300); // Wait for transition
  }

  // Status - Optimistic & Batched
  async function handleStatusToggle(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    
    // 1. Optimistic Update
    queryClient.setQueryData(['tasks', filters], (oldData: any) => {
      if (!oldData || !oldData.data) return oldData;
      return {
        ...oldData,
        data: oldData.data.map((t: Task) => (t.id === id ? { ...t, status: newStatus } : t)),
      };
    });

    // 2. Queue for batching
    pendingUpdatesRef.current[id] = newStatus;

    if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);

    batchTimeoutRef.current = setTimeout(flushUpdates, 2000);
  }

  // Actions
  async function handleDuplicate(id: string) {
    setIsDrawerProcessing(true);
    try {
      await taskService.duplicate(id);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeDrawer();
    } finally {
      setIsDrawerProcessing(false);
    }
  }

  async function handleArchive(id: string) {
    setIsDrawerProcessing(true);
    try {
      await taskService.updateStatus(id, 'CANCELLED');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeDrawer();
    } finally {
      setIsDrawerProcessing(false);
    }
  }

  // Bulk Actions
  async function handleBulkComplete() {
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set());
    
    // Optimistic Update
    queryClient.setQueryData(['tasks', filters], (oldData: any) => {
      if (!oldData || !oldData.data) return oldData;
      return {
        ...oldData,
        data: oldData.data.map((t: Task) => (ids.includes(t.id) ? { ...t, status: 'COMPLETED' } : t)),
      };
    });

    try {
      await taskService.bulkComplete(ids);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  }

  async function handleBulkArchiveConfirmed() {
    const ids = Array.from(selectedIds);
    setConfirmDialog({ isOpen: false, action: null });
    setSelectedIds(new Set());

    // Optimistic Update
    queryClient.setQueryData(['tasks', filters], (oldData: any) => {
      if (!oldData || !oldData.data) return oldData;
      return {
        ...oldData,
        data: oldData.data.filter((t: Task) => !ids.includes(t.id)),
      };
    });

    try {
      await taskService.bulkArchive(ids);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  }

  async function handleBulkDeleteConfirmed() {
    const ids = Array.from(selectedIds);
    setConfirmDialog({ isOpen: false, action: null });
    setSelectedIds(new Set());

    // Optimistic Update
    queryClient.setQueryData(['tasks', filters], (oldData: any) => {
      if (!oldData || !oldData.data) return oldData;
      return {
        ...oldData,
        data: oldData.data.filter((t: Task) => !ids.includes(t.id)),
      };
    });

    try {
      await taskService.bulkDelete(ids);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  }

  async function handleDeleteConfirmed() {
    if (confirmDialog.taskId) {
      const id = confirmDialog.taskId;
      setConfirmDialog({ isOpen: false, action: null });
      closeDrawer();

      // Optimistic Update
      queryClient.setQueryData(['tasks', filters], (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((t: Task) => t.id !== id),
        };
      });

      try {
        await deleteTask.mutateAsync(id);
      } catch {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    } else {
      setConfirmDialog({ isOpen: false, action: null });
    }
  }

  // Confirm Dialog Handler
  function executeConfirmAction() {
    switch (confirmDialog.action) {
      case 'delete': return handleDeleteConfirmed();
      case 'bulkDelete': return handleBulkDeleteConfirmed();
      case 'bulkArchive': return handleBulkArchiveConfirmed();
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#050505]">
      {/* Header Area */}
      <div className="flex-shrink-0">
        <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <h1 className="text-2xl font-bold text-[#eeeef0]">Tasks</h1>
          <p className="text-sm text-[#94949e] mt-1">Manage, prioritize, and track your work.</p>
        </div>

        <TaskToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onNewTask={handleNewTask}
          filtersOpen={filtersOpen}
          onToggleFilters={() => setFiltersOpen(!filtersOpen)}
          totalItems={pagination.totalItems}
        />

        <TaskFilters
          filters={filters}
          onChange={setFilters}
          isOpen={filtersOpen}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <TaskTable
          tasks={tasks}
          pagination={pagination}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onTaskClick={handleTaskClick}
          onStatusToggle={handleStatusToggle}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      </div>

      {/* Floating Elements */}
      <BulkActions
        selectedCount={selectedIds.size}
        onComplete={handleBulkComplete}
        onArchive={() => setConfirmDialog({ isOpen: true, action: 'bulkArchive' })}
        onDelete={() => setConfirmDialog({ isOpen: true, action: 'bulkDelete' })}
        onClearSelection={() => setSelectedIds(new Set())}
      />

      <TaskDrawer
        task={activeTask}
        isOpen={isDrawerOpen}
        isEditing={isEditing}
        isProcessing={isDrawerProcessing}
        onClose={closeDrawer}
        onEdit={() => setIsEditing(true)}
        onCancelEdit={() => (activeTask ? setIsEditing(false) : closeDrawer())}
        onDuplicate={handleDuplicate}
        onDelete={(id) => setConfirmDialog({ isOpen: true, action: 'delete', taskId: id })}
        onArchive={handleArchive}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.action === 'delete' ? 'Delete Task' :
          confirmDialog.action === 'bulkDelete' ? `Delete ${selectedIds.size} Tasks` :
          'Archive Tasks'
        }
        description={
          confirmDialog.action === 'delete' ? 'Are you sure you want to delete this task? It will be moved to the trash.' :
          confirmDialog.action === 'bulkDelete' ? `Are you sure you want to delete ${selectedIds.size} tasks? They will be moved to the trash.` :
          `Are you sure you want to archive ${selectedIds.size} tasks? They will be marked as cancelled.`
        }
        variant={confirmDialog.action?.includes('Delete') ? 'danger' : 'default'}
        confirmLabel={confirmDialog.action?.includes('Delete') ? 'Delete' : 'Archive'}
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmDialog({ isOpen: false, action: null })}
      />
    </div>
  );
}
