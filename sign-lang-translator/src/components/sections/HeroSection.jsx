// src/components/sections/HeroSection.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import StatusDot from '../ui/StatusDot';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background glows ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Cyan radial glow — top left */}
        <div
          className="absolute"
          style={{
            width: '50vw',
            height: '50vw',
            top: '-10vw',
            left: '-10vw',
            background: 'radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 65%)',
          }}
        />
        {/* Purple radial glow — bottom right */}
        <div
          className="absolute"
          style={{
            width: '55vw',
            height: '55vw',
            bottom: '-15vw',
            right: '-15vw',
            background: 'radial-gradient(circle, rgba(157,78,221,0.1) 0%, transparent 65%)',
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,210,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,210,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        className="page-wrapper relative z-10 flex flex-col items-center text-center gap-8 pt-28 pb-20"
      >
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full font-mono-label"
            style={{
              background: 'rgba(0,210,255,0.06)',
              border: '1px solid rgba(0,210,255,0.2)',
              color: 'var(--neon-cyan)',
            }}
          >
            <StatusDot status="active" />
            NEURAL NETWORK ACTIVE — V2.4.1
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-display-lg text-[var(--on-surface)] max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Breaking{' '}
          <span className="text-gradient-cyan">Communication</span>
          <br />
          Barriers with AI
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-body-md text-[var(--on-surface-variant)] max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Experience cinematic futurism in sign language translation.
          High-fidelity recognition powered by cutting-edge neural networks.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
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
            aria-label="Watch how Signa AI works"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Features
          </GlowButton>
        </motion.div>

        {/* Floating hand illustration placeholder */}
        <motion.div
          className="mt-12 relative animate-float"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          aria-hidden="true"
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: 'min(700px, 90vw)',
              height: 'min(360px, 45vw)',
              background: 'var(--surface-base)',
              border: '1px solid rgba(0,210,255,0.15)',
              boxShadow: '0 0 60px rgba(0,210,255,0.08), 0 0 120px rgba(157,78,221,0.06)',
            }}
          >
            {/* Decorative scan line */}
            <div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(0,210,255,0.5), transparent)',
                animation: 'scan 4s linear infinite',
              }}
            />
            {/* Corner brackets */}
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-5 h-5`}
                style={{
                  borderTop: i < 2 ? '2px solid rgba(0,210,255,0.6)' : 'none',
                  borderBottom: i >= 2 ? '2px solid rgba(0,210,255,0.6)' : 'none',
                  borderLeft: i % 2 === 0 ? '2px solid rgba(0,210,255,0.6)' : 'none',
                  borderRight: i % 2 === 1 ? '2px solid rgba(0,210,255,0.6)' : 'none',
                }}
              />
            ))}
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <StatusDot status="active" />
                <span className="font-mono-label" style={{ color: 'var(--neon-cyan)' }}>
                  LIVE FEED READY
                </span>
              </div>
              <p className="font-mono-code text-[var(--on-surface-variant)] text-xs">
                ENABLE CAMERA TO ACTIVATE NEURAL TRACKING
              </p>
              <Link to="/dashboard">
                <GlowButton size="sm" aria-label="Open dashboard">
                  Activate Dashboard
                </GlowButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-hidden="true"
      >
        <span className="font-mono-label text-[var(--outline)] text-xs">SCROLL</span>
        <ChevronDown
          size={16}
          style={{ color: 'var(--outline)', animation: 'float 2s ease-in-out infinite' }}
        />
      </motion.div>
    </section>
  );
}
