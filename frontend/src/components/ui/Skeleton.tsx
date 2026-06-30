interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[rgba(255,255,255,0.06)] ${className}`}
    />
  );
}

export function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-5 w-16 ml-auto" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-4 w-4" />
    </div>
  );
}
