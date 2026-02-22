import { colors } from './colors';
import { shadows } from './shadows';

export const focus = {
  // Ring configuration
  ring: {
    width: '2px',
    color: colors.primary[500],
    offset: '4px',
    shadow: shadows.glow.primary,
  },

  // CSS classes
  classes: {
    default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-900',
    primary: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4',
    success: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-500 focus-visible:ring-offset-4',
    warning: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning-500 focus-visible:ring-offset-4',
    danger: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-500 focus-visible:ring-offset-4',
  },

  // Styles for direct CSS usage
  styles: {
    default: {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colors.primary[500]}, 0 0 0 6px rgba(157, 51, 255, 0.15)`,
    },
    success: {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colors.success[500]}, 0 0 0 6px rgba(16, 185, 129, 0.15)`,
    },
    warning: {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colors.warning[500]}, 0 0 0 6px rgba(245, 158, 11, 0.15)`,
    },
    danger: {
      outline: 'none',
      boxShadow: `0 0 0 2px ${colors.danger[500]}, 0 0 0 6px rgba(239, 68, 68, 0.15)`,
    },
  },
} as const;
