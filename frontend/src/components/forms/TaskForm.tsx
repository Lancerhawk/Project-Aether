'use client';

import { useState, useEffect } from 'react';
import { CreateTaskInput, UpdateTaskInput, Task } from '@/types/task';
import { Priority, EnergyLevel } from '@/types/enums';
import { TagSelector } from '@/components/data-display/TagSelector';

interface TaskFormProps {
  initialData?: Task | null;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({ initialData, onSubmit, onCancel, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'MEDIUM');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | ''>(initialData?.energyLevel || '');
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>(
    initialData?.estimatedMinutes?.toString() || ''
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : ''
  );
  const [tagIds, setTagIds] = useState<string[]>(
    initialData?.taskTags?.map((tt) => tt.tagId) || []
  );
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>(
    initialData ? [] : ['']
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (estimatedMinutes && (isNaN(Number(estimatedMinutes)) || Number(estimatedMinutes) < 1)) {
      newErrors.estimatedMinutes = 'Must be a positive number.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data: CreateTaskInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      energyLevel: energyLevel || undefined,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
    };

    if (!initialData && subtaskInputs.filter((s) => s.trim()).length > 0) {
      data.subtasks = subtaskInputs.filter((s) => s.trim()).map((s) => ({ title: s.trim() }));
    }

    onSubmit(data);
  }

  function addSubtaskInput() {
    setSubtaskInputs([...subtaskInputs, '']);
  }

  function updateSubtaskInput(idx: number, value: string) {
    const next = [...subtaskInputs];
    next[idx] = value;
    setSubtaskInputs(next);
  }

  function removeSubtaskInput(idx: number) {
    setSubtaskInputs(subtaskInputs.filter((_, i) => i !== idx));
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, description, priority, energyLevel, estimatedMinutes, dueDate, tagIds]);

  const inputClass = 'w-full bg-transparent border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-sm text-[#eeeef0] placeholder-[#5a5a66] focus:outline-none focus:border-[#6366f1] transition-colors';
  const labelClass = 'block text-sm font-medium text-[#94949e] mb-1.5';
  const selectClass = 'w-full bg-[#0c0c0f] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-sm text-[#eeeef0] focus:outline-none focus:border-[#6366f1] transition-colors appearance-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelClass} htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`${inputClass} ${errors.title ? 'border-[#f43f5e]' : ''}`}
          autoFocus
        />
        {errors.title && <p className="text-[#f43f5e] text-[12px] mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass} htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Priority & Energy */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className={selectClass}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="task-energy">Energy</label>
          <select
            id="task-energy"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel | '')}
            className={selectClass}
          >
            <option value="">None</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {/* Estimated Minutes & Due Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="task-est">Estimated Minutes</label>
          <input
            id="task-est"
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
            placeholder="45"
            min="1"
            max="1440"
            className={`${inputClass} ${errors.estimatedMinutes ? 'border-[#f43f5e]' : ''}`}
          />
          {errors.estimatedMinutes && <p className="text-[#f43f5e] text-[12px] mt-1">{errors.estimatedMinutes}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="task-due">Due Date</label>
          <input
            id="task-due"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <TagSelector selectedTagIds={tagIds} onChange={setTagIds} />
      </div>

      {/* Subtasks (only for new tasks) */}
      {!initialData && (
        <div>
          <label className={labelClass}>Subtasks</label>
          <div className="space-y-2">
            {subtaskInputs.map((val, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => updateSubtaskInput(idx, e.target.value)}
                  placeholder={`Step ${idx + 1}`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeSubtaskInput(idx)}
                  className="text-[#5a5a66] hover:text-[#f43f5e] transition-colors flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSubtaskInput}
              className="text-sm text-[#818cf8] hover:text-[#6366f1] transition-colors"
            >
              + Add subtask
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#94949e] rounded-lg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#6366f1] hover:bg-[#818cf8] disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create Task'}
        </button>
      </div>

      <p className="text-[11px] text-[#5a5a66] text-center">
        Press <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#94949e] font-mono">Ctrl+Enter</kbd> to save, <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#94949e] font-mono">Esc</kbd> to cancel
      </p>
    </form>
  );
}
