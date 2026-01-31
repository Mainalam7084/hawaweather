// Motion Configuration
// Animation timing and easing configurations for future animation library

export const motionConfig = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
  },
  transitions: {
    pageTransition: {
      duration: 0.3,
      easing: 'easeInOut',
    },
    elementTransition: {
      duration: 0.2,
      easing: 'easeOut',
    },
  },
};
