/**
 * components/LoadingScreen.jsx
 * Phase 2 — Fullscreen AI initialization loading experience.
 * Shows once per session (sessionStorage flag).
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TERMINAL_STEPS = [
  { text: 'Initializing Vision Engine',       delay: 0 },
  { text: 'Loading Hand Detection Module',     delay: 750 },
  { text: 'Compiling ASLNet Weights',          delay: 1500 },
  { text: 'Calibrating MediaPipe Pipeline',    delay: 2150 },
  { text: 'Connecting Translation Core',       delay: 2750 },
  { text: 'Warming Up Neural Inference',       delay: 3250 },
  { text: 'System Check ✓ All Systems Ready',  delay: 3700 },
];

const TOTAL_DURATION = 4400; // ms before auto-exit

function TypingLine({ text, startDelay, onDone }) {
  const [displayed, setDisplayed] = useState('');
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
          onDone?.();
        }
      }, 22);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-2" style={{ opacity: displayed ? 1 : 0, transition: 'opacity 0.2s' }}>
      <span style={{ color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>▶</span>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: done ? 'rgba(255,255,255,0.75)' : 'var(--neon-cyan)', letterSpacing: '0.03em' }}>
        {displayed}
        {!done && <span className="terminal-cursor" style={{ width: 6, height: 11 }} />}
      </span>
      {done && (
        <span style={{ color: 'var(--neon-green)', fontFamily: 'JetBrains Mono', fontSize: 10, marginLeft: 4 }}>OK</span>
      )}
    </div>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [progress,    setProgress]    = useState(0);
  const [activeLines, setActiveLines] = useState([0]);

  useEffect(() => {
    // Animate progress bar
    const steps = TERMINAL_STEPS.length;
    TERMINAL_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setProgress(Math.round(((i + 1) / steps) * 100));
        if (i < steps - 1) {
          setActiveLines((prev) => [...prev, i + 1]);
        }
      }, step.delay + 320);
    });

    // Trigger completion
    const t = setTimeout(() => {
      onComplete?.();
    }, TOTAL_DURATION);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'var(--surface)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}
      aria-label="Loading Signa AI"
      role="status"
    >
      {/* Background glows */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw',
          top: '-20vw', left: '-10vw',
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)',
          animation: 'orb-drift 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw',
          bottom: '-20vw', right: '-10vw',
          background: 'radial-gradient(circle, rgba(180,77,255,0.08) 0%, transparent 65%)',
          animation: 'orb-drift 16s ease-in-out infinite reverse',
        }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.8) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 1 }}
      >
        {/* Animated glow ring */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute', width: 90, height: 90, borderRadius: '50%',
            border: '1px solid rgba(0,229,255,0.3)',
            animation: 'glow-ring 2.5s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 90, height: 90, borderRadius: '50%',
            border: '1px solid rgba(180,77,255,0.2)',
            animation: 'glow-ring 2.5s ease-out infinite 0.8s',
          }} />
          {/* Logo icon */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(180,77,255,0.15))',
            border: '1.5px solid rgba(0,229,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 4 L30 10 L30 22 L18 32 L6 22 L6 10 Z" stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.08)" />
              <path d="M18 10 L24 14 L24 22 L18 26 L12 22 L12 14 Z" stroke="#b44dff" strokeWidth="1" fill="rgba(180,77,255,0.08)" />
              <circle cx="18" cy="18" r="3" fill="#00e5ff" />
            </svg>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            marginTop: 24,
            fontFamily: 'Orbitron, Inter, sans-serif',
            fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(135deg, #00e5ff, #b44dff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '0.06em',
          }}
        >
          SIGNA AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--outline)', letterSpacing: '0.15em', marginTop: 4 }}
        >
          ASL NEURAL TRANSLATOR v3.0
        </motion.p>
      </motion.div>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          width: 'min(480px, 90vw)',
          background: 'rgba(0, 0, 0, 0.55)',
          border: '1px solid rgba(0,229,255,0.15)',
          borderRadius: 12,
          padding: '16px 20px',
          backdropFilter: 'blur(20px)',
          position: 'relative', zIndex: 1,
          marginBottom: 32,
        }}
      >
        {/* Terminal bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', marginLeft: 6, letterSpacing: '0.08em' }}>
            signa-ai — initialization
          </span>
        </div>

        {/* Terminal lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {TERMINAL_STEPS.map((step, i) => (
            activeLines.includes(i) && (
              <TypingLine
                key={i}
                text={step.text}
                startDelay={0}
              />
            )
          ))}
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ width: 'min(480px, 90vw)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', letterSpacing: '0.08em' }}>
            SYSTEM INITIALIZATION
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon-cyan)' }}>
            {progress}%
          </span>
        </div>

        <div style={{
          height: 3, background: 'rgba(255,255,255,0.05)',
          borderRadius: 2, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <motion.div
            style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(to right, #00e5ff, #b44dff)',
              boxShadow: '0 0 12px rgba(0,229,255,0.5)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
