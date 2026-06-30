'use client';

interface BulkActionsProps {
  selectedCount: number;
  onComplete: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, onComplete, onArchive, onDelete, onClearSelection }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0c0f]/95 backdrop-blur-lg shadow-2xl animate-in slide-in-from-bottom-4">
      <span className="text-sm font-medium text-[#eeeef0]">
        {selectedCount} selected
      </span>

      <div className="w-px h-5 bg-[rgba(255,255,255,0.08)]" />

      <button
        onClick={onComplete}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#34d399] rounded-lg hover:bg-[rgba(52,211,153,0.1)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Complete
      </button>

      <button
        onClick={onArchive}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#fbbf24] rounded-lg hover:bg-[rgba(251,191,36,0.1)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 8v13H3V8" />
          <path d="M1 3h22v5H1z" />
          <path d="M10 12h4" />
        </svg>
        Archive
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#f43f5e] rounded-lg hover:bg-[rgba(244,63,94,0.1)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6M8 6V4h8v2" />
        </svg>
        Delete
      </button>

      <div className="w-px h-5 bg-[rgba(255,255,255,0.08)]" />

      <button
        onClick={onClearSelection}
        className="text-sm text-[#94949e] hover:text-[#eeeef0] transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
