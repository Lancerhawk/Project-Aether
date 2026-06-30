'use client';

import { useState, useEffect, useRef } from 'react';
import { SubTask } from '@/types/task';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { apiRequest } from '@/services/api';

interface SubTaskListProps {
  taskId: string;
  subtasks: SubTask[];
  onUpdate: () => void;
}

export function SubTaskList({ taskId, subtasks, onUpdate }: SubTaskListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // Optimistic UI state
  const [optimisticSubtasks, setOptimisticSubtasks] = useState(subtasks);
  const pendingUpdatesRef = useRef<Record<string, boolean>>({});
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track latest subtasks for the unmount closure
  const subtasksRef = useRef(subtasks);
  useEffect(() => {
    subtasksRef.current = subtasks;
  }, [subtasks]);

  const flushUpdates = async (isUnloading = false) => {
    const updates = { ...pendingUpdatesRef.current };
    pendingUpdatesRef.current = {};

    const netToggles = [];
    for (const [id, finalStatus] of Object.entries(updates)) {
      const original = subtasksRef.current.find(s => s.id === id);
      if (original && original.isCompleted !== finalStatus) {
        netToggles.push(id);
      }
    }

    if (netToggles.length > 0) {
      try {
        await Promise.all(
          netToggles.map(id => 
            apiRequest(`/v1/tasks/${taskId}/subtasks/${id}/toggle`, { 
              method: 'PATCH',
              keepalive: isUnloading
            })
          )
        );
        if (!isUnloading) onUpdate();
      } catch (error) {
        console.error('Failed to save batched subtask updates', error);
      }
    }
  };

  // Sync with props only if no pending updates
  useEffect(() => {
    if (Object.keys(pendingUpdatesRef.current).length === 0) {
      setOptimisticSubtasks(subtasks);
    }
  }, [subtasks]);

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

  const completed = optimisticSubtasks.filter((st) => st.isCompleted).length;
  const total = optimisticSubtasks.length;

  async function handleToggle(subtaskId: string) {
    const st = optimisticSubtasks.find(s => s.id === subtaskId);
    if (!st) return;
    
    const newStatus = !st.isCompleted;

    // 1. Optimistic Update
    setOptimisticSubtasks(prev => prev.map(s => s.id === subtaskId ? { ...s, isCompleted: newStatus } : s));

    // 2. Queue for batching
    pendingUpdatesRef.current[subtaskId] = newStatus;

    if (batchTimeoutRef.current) clearTimeout(batchTimeoutRef.current);

    batchTimeoutRef.current = setTimeout(flushUpdates, 1000);
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    try {
      await apiRequest(`/v1/tasks/${taskId}/subtasks`, {
        method: 'POST',
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      setNewTitle('');
      onUpdate();
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDelete(subtaskId: string) {
    await apiRequest(`/v1/tasks/${taskId}/subtasks/${subtaskId}`, { method: 'DELETE' });
    onUpdate();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-[#eeeef0]">Subtasks</h4>
        {total > 0 && <span className="text-[11px] text-[#94949e]">{completed}/{total}</span>}
      </div>

      {total > 0 && <ProgressBar value={completed} max={total} />}

      <div className="space-y-1">
        {optimisticSubtasks.map((st) => (
          <div
            key={st.id}
            className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          >
            <button
              onClick={() => handleToggle(st.id)}
              className={`flex-shrink-0 w-4 h-4 rounded border-2 transition-all ${
                st.isCompleted
                  ? 'bg-[#34d399] border-[#34d399]'
                  : 'border-[rgba(255,255,255,0.2)] hover:border-[#6366f1]'
              }`}
              aria-label={st.isCompleted ? 'Mark incomplete' : 'Mark complete'}
            >
              {st.isCompleted && (
                <svg className="w-full h-full text-white" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${st.isCompleted ? 'line-through text-[#5a5a66]' : 'text-[#eeeef0]'}`}>
              {st.title}
            </span>
            <button
              onClick={() => handleDelete(st.id)}
              className="opacity-0 group-hover:opacity-100 text-[#5a5a66] hover:text-[#f43f5e] transition-all"
              aria-label={`Delete subtask: ${st.title}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a subtask..."
          className="flex-1 bg-transparent border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1.5 text-sm text-[#eeeef0] placeholder-[#5a5a66] focus:outline-none focus:border-[#6366f1] transition-colors"
          disabled={isAdding}
        />
        <button
          onClick={handleAdd}
          disabled={!newTitle.trim() || isAdding}
          className="px-3 py-1.5 text-sm font-medium text-[#818cf8] hover:text-[#6366f1] disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
