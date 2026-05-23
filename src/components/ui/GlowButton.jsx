// src/components/ui/GlowButton.jsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * GlowButton — high-visibility action trigger.
 * variant: 'primary' (cyan→purple gradient) | 'ghost' | 'danger'
 */
const GlowButton = forwardRef(function GlowButton(
  {
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    type = 'button',
    'aria-label': ariaLabel,
    ...props
  },
  ref
) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClass =
    variant === 'ghost' ? 'glow-btn--ghost' :
    variant === 'danger' ? 'glow-btn--danger' : '';

  return (
    <motion.button
      ref={ref}
      type={type}
      className={`glow-btn ${variantClass} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

export default GlowButton;
