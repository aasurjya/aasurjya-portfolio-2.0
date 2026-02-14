/**
 * Centralized theme color utilities for the portfolio
 * Eliminates duplicated color logic across components
 */

export type Mode = 'xr' | 'fullstack' | null

export const THEME_COLORS = {
  xr: {
    primary: '#10b981',     // emerald-500
    secondary: '#06b6d4',   // cyan-500
    bg: '#021a1a',
    text: 'text-teal-400',
    bgClass: 'bg-teal-500',
    bgOpacity: 'bg-teal-500/10',
    border: 'border-teal-500/30',
  },
  fullstack: {
    primary: '#8b5cf6',     // violet-500
    secondary: '#6366f1',   // indigo-500 (also used: #ec4899 pink-500 for some gradients)
    bg: '#0a0515',
    text: 'text-purple-400',
    bgClass: 'bg-purple-500',
    bgOpacity: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  },
  default: {
    primary: '#22d3ee',     // cyan-400
    secondary: '#818cf8',   // indigo-400
    bg: '#030708',
    text: 'text-purple-400',
    bgClass: 'bg-purple-500',
    bgOpacity: 'bg-purple-500/10',
    border: 'border-purple-500/30',
  }
} as const

/**
 * Get full theme configuration for a mode
 */
export function getTheme(mode: Mode) {
  return THEME_COLORS[mode || 'default']
}

/**
 * Get the text color class for the current mode
 */
export function getModeColor(mode: Mode): string {
  return getTheme(mode).text
}

/**
 * Get the background color class for the current mode
 */
export function getModeBg(mode: Mode): string {
  return getTheme(mode).bgClass
}

/**
 * Get the background opacity class for the current mode
 */
export function getModeBgOpacity(mode: Mode): string {
  return getTheme(mode).bgOpacity
}

/**
 * Get the border color class for the current mode
 */
export function getModeBorder(mode: Mode): string {
  return getTheme(mode).border
}

/**
 * Get liquid/gradient colors for animated backgrounds
 */
export function getLiquidColors(mode: Mode) {
  const theme = getTheme(mode)
  return {
    primary: theme.primary,
    secondary: theme.secondary,
    bg: theme.bg
  }
}

/**
 * Get the accent gradient Tailwind classes
 */
export function getAccentGradient(mode: Mode): string {
  switch (mode) {
    case 'xr':
      return 'from-emerald-400 via-teal-500 to-cyan-500'
    case 'fullstack':
      return 'from-violet-400 via-purple-500 to-indigo-500'
    default:
      return 'from-cyan-400 via-blue-500 to-violet-500'
  }
}

/**
 * Get gradient colors object for inline styles
 */
export function getModeGradient(mode: Mode) {
  switch (mode) {
    case 'xr':
      return { primary: '#14b8a6', secondary: '#06b6d4' }
    case 'fullstack':
      return { primary: '#8b5cf6', secondary: '#ec4899' }
    default:
      return { primary: '#8b5cf6', secondary: '#ec4899' }
  }
}
