'use client';

import { type ReactNode, useState, useRef, useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  children?: ReactNode;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmBtnClass = variant === 'danger'
    ? 'bg-[#f43f5e] hover:bg-[#e11d48] text-white'
    : 'bg-[#6366f1] hover:bg-[#818cf8] text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0c0c0f] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h3 id="confirm-title" className="text-lg font-semibold text-[#eeeef0] mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#94949e] mb-6">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#94949e] rounded-lg border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={async () => {
              setIsLoading(true);
              try {
                await onConfirm();
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${confirmBtnClass}`}
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="rgba(255,255,255,0.2)"></circle>
                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"></path>
              </svg>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
