'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskSearch({ value, onChange }: TaskSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a66]"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-9 pr-3 py-2 bg-[#0c0c0f] border border-[rgba(255,255,255,0.06)] rounded-lg text-sm text-[#eeeef0] placeholder-[#5a5a66] focus:outline-none focus:border-[#6366f1] transition-colors"
        aria-label="Search tasks"
      />
      {localValue && (
        <button
          onClick={() => { setLocalValue(''); onChange(''); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a66] hover:text-[#eeeef0] transition-colors"
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
