import { Badge } from '@/components/ui/Badge';
import { EnergyLevel } from '@/types/enums';

interface EnergyBadgeProps {
  energy: EnergyLevel;
}

const energyConfig: Record<EnergyLevel, { label: string; variant: 'success' | 'warning' | 'error' }> = {
  LOW: { label: '⚡ Low', variant: 'success' },
  MEDIUM: { label: '⚡⚡ Med', variant: 'warning' },
  HIGH: { label: '⚡⚡⚡ High', variant: 'error' },
};

export function EnergyBadge({ energy }: EnergyBadgeProps) {
  const config = energyConfig[energy];
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
}
