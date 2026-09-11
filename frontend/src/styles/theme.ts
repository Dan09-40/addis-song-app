export const theme = {
  colors: {
    bgDark: '#0f172a',
    bgCard: '#1e293b',
    bgCardGlass: 'rgba(30, 41, 59, 0.75)',
    bgCardHover: '#26354a',
    border: 'rgba(255, 255, 255, 0.1)',
    borderActive: '#6366f1',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accentGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    success: '#10b981',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6',
    pillBg: 'rgba(99, 102, 241, 0.15)',
    pillActive: '#6366f1'
  },
  shadows: {
    card: '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
    glow: '0 0 20px rgba(99, 102, 241, 0.4)'
  },
  radii: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    full: '9999px'
  }
};

export type Theme = typeof theme;
