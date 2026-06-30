import { Badge } from '@/components/ui/Badge';
import { Priority } from '@/types/enums';

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { label: string; variant: 'muted' | 'info' | 'warning' | 'error' }> = {
  LOW: { label: 'Low', variant: 'muted' },
  MEDIUM: { label: 'Medium', variant: 'info' },
  HIGH: { label: 'High', variant: 'warning' },
  CRITICAL: { label: 'Critical', variant: 'error' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
