export type SeverityLabel = 'low' | 'medium' | 'high' | 'critical';

export interface Post {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
  severity: SeverityLabel;
  voteCount: number;
  imageUri: string | null;
  createdBy: string;
  category?: string;
}

export const SEVERITY_COLORS: Record<SeverityLabel, string> = {
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

export const SEVERITY_LABELS: Record<SeverityLabel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};
