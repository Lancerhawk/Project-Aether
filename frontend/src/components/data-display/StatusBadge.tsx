import { Badge } from '@/components/ui/Badge';
import { TaskStatus } from '@/types/enums';

interface StatusBadgeProps {
  status: TaskStatus;
}

const statusConfig: Record<TaskStatus, { label: string; variant: 'muted' | 'warning' | 'success' | 'error' }> = {
  TODO: { label: 'To Do', variant: 'muted' },
  IN_PROGRESS: { label: 'In Progress', variant: 'warning' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'error' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
