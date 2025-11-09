export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: '700';
      lineHeight: number;
    };
    h2: {
      fontSize: number;
      fontWeight: '600';
      lineHeight: number;
    };
    h3: {
      fontSize: number;
      fontWeight: '600';
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: '400';
      lineHeight: number;
    };
    bodyBold: {
      fontSize: number;
      fontWeight: '600';
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: '400';
      lineHeight: number;
    };
    button: {
      fontSize: number;
      fontWeight: '600';
      lineHeight: number;
    };
  };
}

export const lightTheme: Theme = {
  colors: {
    primary: '#6366f1', // Indigo
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    secondary: '#ec4899', // Pink
    secondaryDark: '#db2777',
    secondaryLight: '#f472b6',
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#818cf8', // Lighter indigo for dark mode
    primaryDark: '#6366f1',
    primaryLight: '#a5b4fc',
    secondary: '#f472b6', // Lighter pink for dark mode
    secondaryDark: '#ec4899',
    secondaryLight: '#f9a8d4',
    background: '#0f172a',
    surface: '#1e293b',
    card: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
    shadow: '#000000',
  },
};
