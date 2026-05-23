// src/components/dashboard/TranslationPanel.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Square, Trash2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import ConfidenceBar from './ConfidenceBar';
import PredictionHistory from './PredictionHistory';

/**
 * TranslationPanel — right-hand panel on the Dashboard.
 * Shows current detection, confidence, translation text, and history.
 */
export default function TranslationPanel({
  letters = [],
  confidence = 0,
  isSpeaking = false,
  onSpeak,
  onStop,
  onClear,
}) {
  const translationString = letters.map((l) => l.letter).join('');
  const lastLetter = letters[letters.length - 1]?.letter;

  return (
    <aside
      className="flex flex-col gap-4"
      aria-label="Translation output panel"
    >
      {/* ── Current detection ── */}
      <GlassCard animate={false} glow="cyan" className="p-5 text-center">
        <h2 className="font-mono-label text-[var(--on-surface-variant)] uppercase tracking-widest mb-4">
          Live Detection
        </h2>

        <AnimatePresence mode="wait">
          {lastLetter ? (
            <motion.div
              key={lastLetter}
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: -8 }}
              transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              className="font-sans font-black"
              style={{
                fontSize: 72,
                lineHeight: 1,
                background: 'linear-gradient(135deg, #00D2FF, #9D4EDD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
              }}
              aria-live="polite"
              aria-label={`Detected letter: ${lastLetter}`}
            >
              {lastLetter}
            </motion.div>
          ) : (
            <motion.p
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono-code text-[var(--outline)] text-sm py-8"
              aria-live="polite"
            >
              — no sign detected —
            </motion.p>
          )}
        </AnimatePresence>

        {/* Confidence */}
        <div className="mt-4">
          <ConfidenceBar confidence={confidence} label="Confidence" />
        </div>
      </GlassCard>

      {/* ── Translation output ── */}
      <GlassCard animate={false} glow="purple" className="p-5 flex flex-col gap-4">
        <h2 className="font-mono-label text-[var(--on-surface-variant)] uppercase tracking-widest">
          Translation Output
        </h2>

        {/* Text area */}
        <div
          className="min-h-[90px] rounded-lg p-3.5 relative"
          style={{
            background: 'rgba(5,5,5,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          aria-live="polite"
          aria-label="Translation text"
        >
          {translationString ? (
            <div className="flex flex-wrap gap-px items-center">
              <AnimatePresence>
                {letters.map(({ id, letter }) => (
                  <motion.span
                    key={id}
                    initial={{ opacity: 0, y: 6, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="font-sans font-semibold text-[var(--on-surface)]"
                    style={{ fontSize: 22, lineHeight: 1.3 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </AnimatePresence>
              {/* Blinking cursor */}
              <motion.span
                className="inline-block rounded-sm ml-0.5"
                style={{ width: 2, height: 24, background: '#00D2FF' }}
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'steps(1)' }}
                aria-hidden="true"
              />
            </div>
          ) : (
            <p className="font-mono-code text-[var(--outline)] text-sm">
              Translation will appear here...
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2" role="group" aria-label="Translation actions">
          {isSpeaking ? (
            <GlowButton
              variant="primary"
              size="sm"
              className="flex-1 !bg-[#EF4444] !from-[#EF4444] !to-[#EF4444]"
              onClick={onStop}
              aria-label="Stop speech"
              style={{ background: '#EF4444', boxShadow: '0 0 16px rgba(239,68,68,0.3)' }}
            >
              <Square size={13} aria-hidden="true" /> Stop
            </GlowButton>
          ) : (
            <GlowButton
              variant={translationString ? 'primary' : 'ghost'}
              size="sm"
              className="flex-1"
              disabled={!translationString}
              onClick={onSpeak}
              aria-label="Speak translation aloud"
            >
              <Volume2 size={13} aria-hidden="true" /> Speak
            </GlowButton>
          )}

          <GlowButton
            variant="ghost"
            size="sm"
            className="flex-1"
            disabled={!translationString}
            onClick={onClear}
            aria-label="Clear translation"
          >
            <Trash2 size={13} aria-hidden="true" /> Clear
          </GlowButton>
        </div>

        <hr className="laser-divider" />

        {/* History */}
        <PredictionHistory letters={letters} />
      </GlassCard>
    </aside>
  );
}
