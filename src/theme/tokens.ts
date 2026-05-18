export const colors = {
  background: '#F2F7FF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#D0D9E8',
  primary: '#0B409C',
  primaryPressed: '#10316B',
  primaryMuted: 'rgba(11, 64, 156, 0.12)',
  accent: '#FDBE34',
  accentMuted: 'rgba(253, 190, 52, 0.12)',
  error: '#DC2626',
  errorMuted: 'rgba(220, 38, 38, 0.12)',
  textPrimary: '#10316B',
  textSecondary: '#4A5568',
  textMuted: '#8B95A5',
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
