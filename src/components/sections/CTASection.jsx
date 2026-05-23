// src/components/sections/CTASection.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

export default function CTASection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="py-28 relative overflow-hidden"
    >
      {/* Background glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '80vw',
            height: '60vw',
            background:
              'radial-gradient(ellipse, rgba(103,80,164,0.12) 0%, rgba(0,210,255,0.05) 50%, transparent 70%)',
          }}
        />
      </div>

      <div className="page-wrapper relative z-10 flex flex-col items-center text-center gap-8">
        {/* Mono label */}
        <motion.p
          className="font-mono-label"
          style={{ color: 'var(--neon-cyan)' }}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          INITIATE CONNECTION
        </motion.p>

        {/* Headline */}
        <motion.h2
          id="cta-heading"
          className="text-display-sm text-[var(--on-surface)] max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Ready to initiate{' '}
          <span className="text-gradient-cyan">connection</span>?
        </motion.h2>

        {/* Body */}
        <motion.p
          className="text-body-md text-[var(--on-surface-variant)] max-w-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Deploy the premium communication node today and shatter the silence.
          Real-time sign language translation, no installation required.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Link to="/dashboard" tabIndex={-1}>
            <GlowButton size="lg" aria-label="Launch translator dashboard">
              Launch Dashboard <ArrowRight size={18} />
            </GlowButton>
          </Link>
          <GlowButton
            variant="ghost"
            size="lg"
            aria-label="View API documentation"
          >
            View Docs
          </GlowButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { value: '10M+', label: 'Gesture Samples' },
            { value: '<50ms', label: 'Response Time' },
            { value: '99.2%', label: 'Accuracy Rate' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 p-4 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="text-display-sm"
                style={{
                  background: 'linear-gradient(135deg, #00D2FF, #9D4EDD)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </span>
              <span className="font-mono-label text-[var(--on-surface-variant)] uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
