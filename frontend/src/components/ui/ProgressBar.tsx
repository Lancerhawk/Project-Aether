interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#6366f1] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-[#94949e] tabular-nums min-w-[32px] text-right">
        {value}/{max}
      </span>
    </div>
  );
}
