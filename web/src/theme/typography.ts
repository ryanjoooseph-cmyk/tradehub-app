export const typography = {
  // Font families
  fonts: {
    heading: '"Cal Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"Fira Code", "JetBrains Mono", "SF Mono", Consolas, monospace',
  },

  // Heading styles
  headings: {
    h1: {
      fontSize: '3rem', // 48px
      lineHeight: '1.2',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem', // 36px
      lineHeight: '1.3',
      fontWeight: '700',
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.875rem', // 30px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem', // 24px
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.25rem', // 20px
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '0',
    },
    h6: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5',
      fontWeight: '600',
      letterSpacing: '0',
    },
  },

  // Body text styles
  body: {
    lg: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.75',
      fontWeight: '400',
    },
    md: {
      fontSize: '1rem', // 16px
      lineHeight: '1.5',
      fontWeight: '400',
    },
    sm: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: '400',
    },
    xs: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.5',
      fontWeight: '400',
    },
  },

  // Label styles
  label: {
    lg: {
      fontSize: '0.875rem', // 14px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '0.01em',
    },
    md: {
      fontSize: '0.8125rem', // 13px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '0.01em',
    },
    sm: {
      fontSize: '0.75rem', // 12px
      lineHeight: '1.5',
      fontWeight: '500',
      letterSpacing: '0.01em',
    },
  },

  // Code styles
  code: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.7',
    fontWeight: '400',
  },
} as const;
