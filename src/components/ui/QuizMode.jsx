/**
 * components/ui/QuizMode.jsx
 * Phase 6 — Interactive quiz component for the Learning module.
 * Shows a random sign, user picks the correct letter from 4 options.
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { ALL_SIGNS } from '../../utils/aslData';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getQuizQuestion(all) {
  const correct = all[Math.floor(Math.random() * all.length)];
  const wrong   = shuffle(all.filter((s) => s.id !== correct.id)).slice(0, 3);
  const options = shuffle([correct, ...wrong]);
  return { correct, options };
}

export default function QuizMode({ signsPool = ALL_SIGNS, onClose }) {
  const [question,  setQuestion]  = useState(() => getQuizQuestion(signsPool));
  const [selected,  setSelected]  = useState(null);
  const [score,     setScore]     = useState(0);
  const [total,     setTotal]     = useState(0);
  const [streak,    setStreak]    = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const nextQuestion = useCallback(() => {
    setQuestion(getQuizQuestion(signsPool));
    setSelected(null);
  }, [signsPool]);

  const handleSelect = useCallback((option) => {
    if (selected) return;
    setSelected(option.id);
    const isCorrect = option.id === question.correct.id;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        if (next % 3 === 0) setShowCelebration(true);
        return next;
      });
    } else {
      setStreak(0);
    }
    // Auto-advance after 1.2s
    setTimeout(nextQuestion, 1300);
  }, [selected, question, nextQuestion]);

  useEffect(() => {
    if (showCelebration) {
      const t = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showCelebration]);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const { correct, options } = question;

  return (
    <div style={{ position: 'relative' }}>
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 100,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(9,8,15,0.85)', backdropFilter: 'blur(12px)',
              borderRadius: 16, gap: 12,
            }}
          >
            <Trophy size={48} style={{ color: '#f0d070' }} />
            <span style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 700, color: '#f0d070' }}>3 Streak!</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {['⭐','⭐','⭐'].map((s, i) => (
                <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 400 }} style={{ fontSize: 22 }}>{s}</motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 700, color: '#39ff85' }}>{score}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)' }}>CORRECT</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 700, color: 'var(--neon-cyan)' }}>{accuracy}%</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)' }}>ACCURACY</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 700, color: '#f472b6' }}>{streak}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)' }}>STREAK</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={nextQuestion}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 12px', color: 'var(--on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono', fontSize: 10 }}
            aria-label="Skip question"
          >
            <RefreshCw size={12} /> Skip
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 12px', color: 'var(--on-surface-variant)', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 10 }}
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Question */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--outline)', marginBottom: 12, letterSpacing: '0.08em' }}>
          WHICH SIGN IS THIS?
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={correct.id}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '24px 32px',
            }}
          >
            <span style={{ fontSize: 56, lineHeight: 1 }}>{correct.emoji}</span>
            <p style={{ fontFamily: 'Inter', fontSize: 11, color: 'var(--on-surface-variant)', maxWidth: 220, textAlign: 'center', lineHeight: 1.5 }}>
              {correct.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {options.map((option) => {
          const isCorrect = option.id === correct.id;
          const isSelected = selected === option.id;
          const wasAnswered = selected !== null;

          let borderColor = 'rgba(255,255,255,0.08)';
          let bg = 'rgba(255,255,255,0.03)';
          let textColor = 'var(--on-surface)';

          if (wasAnswered) {
            if (isCorrect) { borderColor = '#39ff85'; bg = 'rgba(57,255,133,0.1)'; textColor = '#39ff85'; }
            else if (isSelected) { borderColor = '#ff6b6b'; bg = 'rgba(255,107,107,0.1)'; textColor = '#ff6b6b'; }
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              whileHover={!wasAnswered ? { scale: 1.02, borderColor: 'rgba(0,229,255,0.3)' } : {}}
              whileTap={!wasAnswered ? { scale: 0.98 } : {}}
              transition={{ duration: 0.15 }}
              style={{
                padding: '14px 16px', borderRadius: 12,
                background: bg, border: `1px solid ${borderColor}`,
                color: textColor, cursor: wasAnswered ? 'default' : 'pointer',
                fontFamily: 'Inter', fontWeight: 700, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
              }}
              aria-label={`Option: ${option.label}`}
              disabled={!!selected}
            >
              {wasAnswered && isCorrect && <CheckCircle size={16} />}
              {wasAnswered && isSelected && !isCorrect && <XCircle size={16} />}
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
