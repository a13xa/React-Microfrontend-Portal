export interface DesignTokens {
  colors: {
    accent: string;
    accentHover: string;
    accentSubtle: string;
    danger: string;
    dangerSubtle: string;
    success: string;
    successSubtle: string;
    warning: string;
    warningSubtle: string;
    bg: string;
    surface: string;
    surfaceRaised: string;
    border: string;
    borderSubtle: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const tokens: DesignTokens = {
  colors: {
    accent: '#1B4332',
    accentHover: '#143728',
    accentSubtle: '#F0F7F4',
    danger: '#B91C1C',
    dangerSubtle: '#FEF2F2',
    success: '#15803D',
    successSubtle: '#F0FDF4',
    warning: '#B45309',
    warningSubtle: '#FFFBEB',
    bg: '#F7F6F3',
    surface: '#FFFFFF',
    surfaceRaised: '#F2F1EE',
    border: '#E2E0DB',
    borderSubtle: '#EEEDEA',
    text: '#2D2A26',
    textSecondary: '#6B6560',
    textTertiary: '#9C968F',
    textInverse: '#FFFFFF',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
};
