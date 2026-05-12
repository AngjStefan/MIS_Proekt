export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUri?: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
  severity: Severity;
  voteCount: number;
  createdAt: string;
  authorId: string;
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#F97316',
  critical: '#EF4444',
};