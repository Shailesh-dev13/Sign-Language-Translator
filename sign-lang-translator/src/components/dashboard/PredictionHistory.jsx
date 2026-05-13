// src/components/dashboard/PredictionHistory.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

/**
 * Recent prediction chip list — shows last N detected signs.
 */
export default function PredictionHistory({ letters = [], maxVisible = 20 }) {
  const visible = letters.slice(-maxVisible);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={13} style={{ color: 'var(--outline)' }} aria-hidden="true" />
        <h4 className="font-mono-label text-[var(--on-surface-variant)] uppercase tracking-wide">
          Recent Predictions
        </h4>
      </div>

      {visible.length === 0 ? (
        <p className="text-xs text-[var(--outline)] font-mono-code">
          — awaiting input —
        </p>
      ) : (
        <div
          className="flex flex-wrap gap-1.5"
          role="list"
          aria-label="Recently detected signs"
        >
          <AnimatePresence>
            {visible.map(({ id, letter }, i) => {
              const isLatest = i === visible.length - 1;
              return (
                <motion.span
                  key={id}
                  role="listitem"
                  aria-label={`Letter ${letter}`}
                  initial={{ opacity: 0, scale: 0.5, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                  className="inline-flex items-center justify-center font-mono-code rounded-md font-semibold"
                  style={{
                    width: 28,
                    height: 28,
                    fontSize: 12,
                    background: isLatest
                      ? 'rgba(0,210,255,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    border: isLatest
                      ? '1px solid rgba(0,210,255,0.4)'
                      : '1px solid rgba(255,255,255,0.06)',
                    color: isLatest ? '#00D2FF' : 'var(--on-surface-variant)',
                    boxShadow: isLatest ? '0 0 8px rgba(0,210,255,0.2)' : 'none',
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
