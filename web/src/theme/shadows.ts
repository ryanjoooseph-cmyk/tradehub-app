export const shadows = {
  // Elevation shadows
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // Glow shadows for interactive elements
  glow: {
    primary: '0 0 0 4px rgba(157, 51, 255, 0.15)',
    success: '0 0 0 4px rgba(16, 185, 129, 0.15)',
    warning: '0 0 0 4px rgba(245, 158, 11, 0.15)',
    danger: '0 0 0 4px rgba(239, 68, 68, 0.15)',
    info: '0 0 0 4px rgba(59, 130, 246, 0.15)',
  },
  
  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // None
  none: '0 0 #0000',
} as const;
