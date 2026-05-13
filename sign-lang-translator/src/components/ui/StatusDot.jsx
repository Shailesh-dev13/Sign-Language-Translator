// src/components/ui/StatusDot.jsx

/**
 * AI Status Indicator — JetBrains Mono label + pulsing bioluminescent dot.
 * status: 'active' | 'idle' | 'processing' | 'offline'
 */
export default function StatusDot({ status = 'active', label, className = '' }) {
  const colors = {
    active: '#00D2FF',
    processing: '#e7c365',
    idle: '#cbc4d2',
    offline: '#ffb4ab',
  };

  const color = colors[status] ?? colors.active;

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono-label ${className}`}
      role="status"
      aria-label={label ?? `Status: ${status}`}
    >
      <span
        className="relative flex items-center justify-center"
        style={{ width: 10, height: 10 }}
      >
        {/* Expanding ring */}
        <span
          className="absolute inline-block rounded-full"
          style={{
            width: 10,
            height: 10,
            background: color,
            opacity: 0.3,
            animation: 'glow-ring 2s ease-in-out infinite',
          }}
        />
        {/* Solid core */}
        <span
          className="relative inline-block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: color,
            boxShadow: `0 0 8px ${color}, 0 0 16px ${color}50`,
            animation: 'pulse-dot 2s ease-in-out infinite',
          }}
        />
      </span>
      {label && (
        <span style={{ color: 'var(--on-surface-variant)' }}>{label}</span>
      )}
    </span>
  );
}
