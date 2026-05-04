export const colors = {
  background: '#18181B',
  surface: '#1F1F23',
  surfaceElevated: '#27272A',
  border: '#3F3F46',
  primary: '#14B8A6',
  primaryPressed: '#0D9488',
  primaryMuted: 'rgba(20, 184, 166, 0.12)',
  accent: '#F59E0B',
  accentMuted: 'rgba(245, 158, 11, 0.12)',
  error: '#DC2626',
  errorMuted: 'rgba(220, 38, 38, 0.12)',
  textPrimary: '#F4F4F5',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  white: '#FFFFFF',
  black: '#09090B',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xl2: 48,
  xl3: 64,
};

export const typography = {
  heading: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
