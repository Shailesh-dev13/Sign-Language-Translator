/**
 * components/sections/HeroSection.jsx — Enhanced with 3D hand and richer animations.
 */

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import StatusDot from '../ui/StatusDot';

// Lazy-load the heavy Three.js hand to keep initial bundle fast
const HandModel = lazy(() => import('../../three/HandModel'));

function HandFallback() {
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 320,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle, rgba(0,229,255,0.04), transparent)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '2px solid rgba(0,229,255,0.15)', borderTopColor: '#00e5ff',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background glows ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Cyan radial — top left */}
        <div className="absolute" style={{
          width: '55vw', height: '55vw', top: '-12vw', left: '-12vw',
          background: 'radial-gradient(circle, rgba(0,229,255,0.09) 0%, transparent 65%)',
          animation: 'orb-drift 14s ease-in-out infinite',
        }} />
        {/* Purple radial — bottom right */}
        <div className="absolute" style={{
          width: '60vw', height: '60vw', bottom: '-18vw', right: '-16vw',
          background: 'radial-gradient(circle, rgba(180,77,255,0.1) 0%, transparent 65%)',
          animation: 'orb-drift 18s ease-in-out infinite reverse',
        }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{
          opacity: 0.028,
          backgroundImage: `linear-gradient(rgba(0,229,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
      </div>

      {/* ── Content ── */}
      <div className="page-wrapper relative z-10 flex flex-col items-center text-center gap-8 pt-28 pb-20 w-full">
        {/* Status badge */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <span
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full font-mono-label"
            style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.22)', color: 'var(--neon-cyan)' }}
          >
            <StatusDot status="active" />
            NEURAL NETWORK ACTIVE — V3.0
          </span>
        </motion.div>

        {/* Two-column layout on desktop: text left, hand right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, width: '100%', maxWidth: 1100, margin: '0 auto' }}>
          {/* Left: text */}
          <div style={{ flex: '1 1 auto', textAlign: 'left', minWidth: 0 }}>
            <motion.h1
              className="text-display-lg"
              style={{ color: 'var(--on-surface)', marginBottom: 20 }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Breaking{' '}
              <span className="text-gradient-cyan animate-neon-flicker">Communication</span>
              <br />
              Barriers with AI
            </motion.h1>

            <motion.p
              className="text-body-md"
              style={{ color: 'var(--on-surface-variant)', maxWidth: 460, marginBottom: 32 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Experience cinematic futurism in sign language translation.
              High-fidelity ASL recognition powered by cutting-edge neural networks — all running locally.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/dashboard" tabIndex={-1}>
                <GlowButton size="lg" aria-label="Open live translation dashboard">
                  Begin Translation <ArrowRight size={18} />
                </GlowButton>
              </Link>
              <GlowButton
                variant="ghost"
                size="lg"
                aria-label="Explore features"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
              </GlowButton>
            </motion.div>

            {/* Stats row */}
            <motion.div
              style={{ display: 'flex', gap: 28, marginTop: 36, flexWrap: 'wrap' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { value: '< 50ms', label: 'Latency' },
                { value: '29 Signs', label: 'A–Z + Space' },
                { value: '100%', label: 'On-Device' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontFamily: 'Orbitron, Inter', fontSize: 18, fontWeight: 700, color: 'var(--neon-cyan)', lineHeight: 1.2 }}>{stat.value}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', letterSpacing: '0.06em', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D hand — hidden on mobile */}
          <motion.div
            style={{ flex: '0 0 380px', height: 380, position: 'relative' }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="hidden lg:block"
            aria-hidden="true"
          >
            {/* Outer glow ring */}
            <div style={{
              position: 'absolute', inset: '-24px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,229,255,0.07), rgba(180,77,255,0.06), transparent 70%)',
              animation: 'orb-drift 10s ease-in-out infinite',
            }} />
            {/* Canvas container */}
            <div style={{
              width: '100%', height: '100%', borderRadius: 24,
              border: '1px solid rgba(0,229,255,0.12)',
              boxShadow: '0 0 60px rgba(0,229,255,0.07), 0 0 100px rgba(180,77,255,0.06)',
              overflow: 'hidden', position: 'relative',
              background: 'linear-gradient(135deg, rgba(0,229,255,0.02), rgba(180,77,255,0.03))',
            }}>
              {/* Scan line */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: '1px', zIndex: 10, pointerEvents: 'none',
                background: 'linear-gradient(to right, transparent, rgba(0,229,255,0.5), transparent)',
                animation: 'scan 5s linear infinite',
              }} />
              <Suspense fallback={<HandFallback />}>
                <HandModel style={{ width: '100%', height: '100%' }} />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        aria-hidden="true"
      >
        <span className="font-mono-label" style={{ color: 'var(--outline)', fontSize: 9 }}>SCROLL</span>
        <ChevronDown size={16} style={{ color: 'var(--outline)', animation: 'float 2.2s ease-in-out infinite' }} />
      </motion.div>
    </section>
  );
}
