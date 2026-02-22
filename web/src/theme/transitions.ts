export const transitions = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },

  // Easing
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Presets
  button: {
    duration: '200ms',
    property: 'all',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    hover: {
      transform: 'scale(1.02)',
    },
    active: {
      transform: 'scale(0.98)',
    },
  },

  card: {
    duration: '150ms',
    property: 'all',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  toast: {
    duration: '300ms',
    property: 'all',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Animations
  animations: {
    spin: {
      name: 'spin',
      duration: '1s',
      timing: 'linear',
      iteration: 'infinite',
    },
    ping: {
      name: 'ping',
      duration: '1s',
      timing: 'cubic-bezier(0, 0, 0.2, 1)',
      iteration: 'infinite',
    },
    pulse: {
      name: 'pulse',
      duration: '2s',
      timing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      iteration: 'infinite',
    },
    bounce: {
      name: 'bounce',
      duration: '1s',
      timing: 'cubic-bezier(0.8, 0, 1, 1)',
      iteration: 'infinite',
    },
    slideIn: {
      name: 'slideIn',
      duration: '300ms',
      timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    fadeIn: {
      name: 'fadeIn',
      duration: '200ms',
      timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;
