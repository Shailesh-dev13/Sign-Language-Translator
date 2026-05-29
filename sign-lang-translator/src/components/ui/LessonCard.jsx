/**
 * components/ui/LessonCard.jsx
 * Phase 6 — Lesson card for the Learning module with progress indicator.
 */

import { motion } from 'framer-motion';
import { Lock, CheckCircle, PlayCircle, Star } from 'lucide-react';
import { fadeUp } from '../../animations/variants';

/**
 * @param {object}   lesson      — lesson object from aslData.LESSONS
 * @param {number}   progress    — 0–100 completion percentage
 * @param {boolean}  locked      — lesson not yet unlocked
 * @param {boolean}  completed   — lesson finished
 * @param {function} onClick     — called when card is clicked
 */
export default function LessonCard({ lesson, progress = 0, locked = false, completed = false, onClick }) {
  const { title, subtitle, icon, accent, signs, xp } = lesson;

  return (
    <motion.div
      variants={fadeUp}
      onClick={locked ? undefined : onClick}
      whileHover={locked ? {} : { y: -3, scale: 1.005 }}
      whileTap={locked ? {} : { scale: 0.99 }}
      transition={{ duration: 0.22 }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${completed ? accent + '40' : locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 16,
        padding: '20px 22px',
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.45 : 1,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
      aria-label={`${title} lesson, ${progress}% complete${locked ? ', locked' : ''}`}
    >
      {/* Completion glow */}
      {completed && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 50% at 50% 100%, ${accent}10, transparent)`,
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Icon */}
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: `${accent}12`, border: `1px solid ${accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            {icon}
          </div>

          <div>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: 'var(--on-surface)', margin: 0, lineHeight: 1.3 }}>
              {title}
            </h3>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', margin: '3px 0 0', letterSpacing: '0.04em' }}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Status icon */}
        {locked    && <Lock size={16}        style={{ color: 'var(--outline)', flexShrink: 0 }} />}
        {completed && <CheckCircle size={18} style={{ color: accent, flexShrink: 0 }} />}
        {!locked && !completed && <PlayCircle size={18} style={{ color: accent, flexShrink: 0 }} />}
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track" style={{ marginBottom: 10 }}>
        <motion.div
          className="progress-bar-fill"
          style={{ background: `linear-gradient(to right, ${accent}cc, ${accent})` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)' }}>
          {signs.length} signs · {progress}% complete
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={10} style={{ color: '#f0d070' }} />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#f0d070' }}>{xp} XP</span>
        </div>
      </div>
    </motion.div>
  );
}
