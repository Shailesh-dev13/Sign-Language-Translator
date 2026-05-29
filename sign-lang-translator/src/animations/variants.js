/**
 * animations/variants.js
 * Centralised Framer Motion animation variants used across all pages and components.
 */

// ── Page-level transitions ────────────────────────────────────────────────────

export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.3, ease: 'easeIn' } },
};

// ── Container with staggered children ────────────────────────────────────────

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09 },
  },
};

export const staggerContainerFast = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

// ── Card / item fade up ───────────────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: 24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ── Scale pop (for badges, icons, signs) ─────────────────────────────────────

export const scalePop = {
  hidden: { opacity: 0, scale: 0.7 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } },
};

// ── Subtle hover lift for interactive cards ───────────────────────────────────

export const hoverLift = {
  rest:  { y: 0,  boxShadow: '0 4px 24px rgba(0,0,0,0.3)' },
  hover: { y: -4, boxShadow: '0 12px 40px rgba(0,210,255,0.15)', transition: { duration: 0.25 } },
};

// ── Spring bounce (for letters in translation panel) ─────────────────────────

export const letterBounce = {
  initial:  { opacity: 0, y: 6,  scale: 0.7 },
  animate:  { opacity: 1, y: 0,  scale: 1 },
  exit:     { opacity: 0, y: -4, scale: 0.8 },
  transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
};

// ── Pipeline pulse (for AIPipeline flow dots) ─────────────────────────────────

export const pipelinePulse = {
  animate: {
    x: ['0%', '100%'],
    opacity: [0, 1, 1, 0],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
  },
};
