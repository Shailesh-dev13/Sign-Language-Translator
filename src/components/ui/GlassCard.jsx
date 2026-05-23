// src/components/ui/GlassCard.jsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * GlassCard — foundational container from the Cinematic Futurism design system.
 * Features: backdrop-filter blur, translucent border, optional cyan/purple glow on hover.
 */
const GlassCard = forwardRef(function GlassCard(
  { children, className = '', glow = 'none', animate = true, onClick, role, tabIndex, ...props },
  ref
) {
  const glowClass =
    glow === 'cyan' ? 'glass-card--cyan' :
    glow === 'purple' ? 'glass-card--purple' : '';

  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
      }
    : {};

  return (
    <Component
      ref={ref}
      className={`glass-card ${glowClass} ${className}`}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

export default GlassCard;
