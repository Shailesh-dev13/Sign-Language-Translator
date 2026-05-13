// src/components/dashboard/ConfidenceBar.jsx

/**
 * Confidence bar — horizontal progress bar showing model prediction confidence.
 */
export default function ConfidenceBar({ confidence = 0, label, className = '' }) {
  const pct = Math.round(Math.min(Math.max(confidence * 100, 0), 100));

  const color =
    pct >= 80 ? '#00D2FF' :
    pct >= 50 ? '#e7c365' : '#ffb4ab';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono-label text-[var(--on-surface-variant)] uppercase tracking-wide text-xs">
            {label}
          </span>
          <span
            className="font-mono-label text-xs tabular-nums"
            style={{ color }}
          >
            {pct}%
          </span>
        </div>
      )}
      <div
        className="confidence-bar"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Prediction confidence'}
      >
        <div
          className="confidence-bar__fill"
          style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}
