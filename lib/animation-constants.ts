/**
 * Centralized animation constants for consistent motion design
 */

// Durations (in seconds for GSAP, milliseconds for timeouts)
export const DURATIONS = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1,
  // Timeout equivalents in ms
  fastMs: 300,
  normalMs: 500,
  slowMs: 800,
  verySlowMs: 1000,
} as const

// Swipe/Drag thresholds
export const THRESHOLDS = {
  swipeDistance: 100,    // pixels
  swipeVelocity: 500,    // pixels per second
  dragElastic: 0.9,
} as const

// GSAP scroll animation
export const SCROLL = {
  scrubDuration: 0.8,    // scrub smoothness
  staggerDelay: 0.2,     // delay between items
  cardScaleOffset: 0.02, // scale reduction per card in stack
  cardYOffset: 10,       // vertical offset per card in stack
} as const

// Spring physics for Framer Motion
export const SPRINGS = {
  stiff: { type: 'spring', stiffness: 400, damping: 25 } as const,
  normal: { type: 'spring', stiffness: 300, damping: 30 } as const,
  soft: { type: 'spring', stiffness: 150, damping: 15 } as const,
  gentle: { type: 'spring', stiffness: 100, damping: 10 } as const,
} as const

// Easing functions
export const EASINGS = {
  smooth: 'power3.out',
  smoothIn: 'power3.in',
  smoothInOut: 'power3.inOut',
  sine: 'sine.inOut',
  none: 'none',
  // Framer Motion cubic bezier
  portalEase: [0.76, 0, 0.24, 1] as [number, number, number, number],
} as const

// Blob animation presets
export const BLOB_ANIMATION = {
  duration1: 8,
  duration2: 10,
  movement1: { x: 100, y: -50, scale: 1.2 },
  movement2: { x: -80, y: 60, scale: 0.9 },
} as const

// Portal/Modal animation
export const PORTAL = {
  expandDuration: 0.5,
  collapseDelay: 400,    // ms before close animation
  ringSize: { initial: 80, expanded: '200vmax' },
  innerRingSize: { initial: 60, expanded: '180vmax' },
} as const

// Video modal
export const VIDEO_MODAL = {
  buttonSizeDesktop: 80,   // px for normal mode
  buttonSizeXR: 96,        // px for XR mode (larger)
  buttonSizeMobile: 64,    // px for mobile
  closeButtonSize: 48,     // px
} as const
