'use client';

import { Task } from '@/types/task';
import { PriorityBadge } from '@/components/data-display/PriorityBadge';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { EnergyBadge } from '@/components/data-display/EnergyBadge';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (id: string) => void;
  onClick: (task: Task) => void;
  onStatusToggle: (id: string) => void;
}

export function TaskCard({ task, isSelected, isSelectionMode, onSelect, onClick, onStatusToggle }: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED';
  const tags = task.taskTags.map((tt) => tt.tag);
  const subtaskCount = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((st) => st.isCompleted).length;
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && !isCompleted;

  function handleCheckboxClick(e: React.MouseEvent) {
    e.stopPropagation();
    onStatusToggle(task.id);
  }

  function handleSelectClick(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(task.id);
  }

  return (
    <div
      onClick={() => onClick(task)}
      className={`group flex items-center gap-3 px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors hover:bg-[#14141a] ${
        isSelected ? 'bg-[rgba(99,102,241,0.08)]' : ''
      }`}
      role="row"
      aria-selected={isSelected}
    >
      {/* Select checkbox */}
      <div
        onClick={handleSelectClick}
        className={`flex-shrink-0 w-4 h-4 rounded border transition-colors cursor-pointer ${
          isSelectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } ${
          isSelected
            ? 'bg-[#6366f1] border-[#6366f1]'
            : 'border-[rgba(255,255,255,0.12)] hover:border-[#6366f1]'
        }`}
        role="checkbox"
        aria-checked={isSelected}
        aria-label={`Select ${task.title}`}
      >
        {isSelected && (
          <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </div>

      {/* Completion toggle */}
      <button
        onClick={handleCheckboxClick}
        className={`flex-shrink-0 w-4.5 h-4.5 rounded-full border-2 transition-all ${
          isCompleted
            ? 'bg-[#34d399] border-[#34d399]'
            : 'border-[rgba(255,255,255,0.2)] hover:border-[#6366f1]'
        }`}
        aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {isCompleted && (
          <svg className="w-full h-full text-white p-[1px]" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm truncate block ${isCompleted ? 'line-through text-[#5a5a66]' : 'text-[#eeeef0]'}`}>
          {task.title}
        </span>
        {subtaskCount > 0 && (
          <span className="text-[11px] text-[#5a5a66]">
            {completedSubtasks}/{subtaskCount} subtasks
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="hidden md:flex w-24 items-center gap-1 flex-shrink-0 overflow-hidden">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            className="px-1.5 py-0.5 text-[11px] rounded-md font-medium truncate"
            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
          >
            {tag.name}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-[11px] text-[#5a5a66] flex-shrink-0">+{tags.length - 3}</span>
        )}
      </div>

      {/* Priority */}
      <div className="hidden sm:block w-16 flex-shrink-0">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Status */}
      <div className="hidden sm:block w-20 flex-shrink-0">
        <StatusBadge status={task.status} />
      </div>

      {/* Energy */}
      <div className="hidden lg:block w-16 flex-shrink-0">
        {task.energyLevel && <EnergyBadge energy={task.energyLevel} />}
      </div>

      {/* Due date */}
      <div className={`hidden md:block w-16 flex-shrink-0 text-[12px] tabular-nums ${isOverdue ? 'text-[#f43f5e]' : 'text-[#5a5a66]'}`}>
        {dueDate ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
      </div>

      {/* Estimated minutes */}
      <div className="hidden lg:block w-10 flex-shrink-0 text-[12px] text-[#5a5a66] tabular-nums">
        {task.estimatedMinutes ? `${task.estimatedMinutes}m` : ''}
      </div>

      {/* Updated */}
      <div className="hidden xl:block w-16 flex-shrink-0 text-[11px] text-[#5a5a66] tabular-nums">
        {new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}
