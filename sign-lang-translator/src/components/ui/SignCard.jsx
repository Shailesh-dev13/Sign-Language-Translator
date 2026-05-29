/**
 * components/ui/SignCard.jsx
 * Phase 5 — Reusable sign card for Dictionary and Learning modules.
 */

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { DIFFICULTY_COLORS } from '../../utils/aslData';

/**
 * @param {object} sign  — ASL sign data object from aslData.js
 * @param {function} onPractice — called when Practice button is clicked
 * @param {boolean} compact — smaller variant for quizzes
 */
export default function SignCard({ sign, onPractice, compact = false }) {
  const { label, description, difficulty, emoji, category } = sign;
  const diff = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.easy;

  return (
    <motion.div
      className="sign-card"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Sign display area */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,229,255,0.04), rgba(180,77,255,0.04))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: compact ? '20px 16px' : '28px 20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow behind emoji */}
        <div style={{
          position: 'absolute', width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.12), transparent)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Emoji hand representation */}
        <span style={{ fontSize: compact ? 32 : 48, lineHeight: 1, position: 'relative' }}>{emoji}</span>

        {/* Sign label */}
        <div style={{
          fontFamily: 'Orbitron, Inter, sans-serif',
          fontSize: compact ? 22 : 32,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #00e5ff, #b44dff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          lineHeight: 1,
        }}>
          {label}
        </div>

        {/* Difficulty badge */}
        <span className="chip" style={{
          background: diff.bg, border: `1px solid ${diff.border}`, color: diff.text,
        }}>
          {difficulty}
        </span>
      </div>

      {/* Info area */}
      <div style={{ padding: compact ? '12px 14px' : '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!compact && (
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            {description}
          </p>
        )}

        {/* Category tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {category}
          </span>

          {onPractice && (
            <button
              onClick={() => onPractice(sign)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 8,
                background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)',
                color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono', fontSize: 10,
                cursor: 'pointer', transition: 'all 0.2s',
                letterSpacing: '0.04em', fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,229,255,0.15)';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0,229,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,229,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label={`Practice ${label}`}
            >
              <BookOpen size={11} />
              PRACTICE
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
