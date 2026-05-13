// src/components/sections/FeaturesSection.jsx
import { motion } from 'framer-motion';
import { Zap, Mic, Shield, Timer, Target, Cpu } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time Recognition',
    desc: 'Instantaneous processing of complex gestures using localized edge computing.',
    glow: 'cyan',
    accent: '#00D2FF',
  },
  {
    icon: Mic,
    title: 'Speech Synthesis',
    desc: 'Natural, context-aware voice generation tailored to individual pacing.',
    glow: 'purple',
    accent: '#9D4EDD',
  },
  {
    icon: Shield,
    title: 'Privacy-First Local AI',
    desc: 'Zero telemetry. All processing happens on-device ensuring data sovereignty.',
    glow: 'cyan',
    accent: '#00D2FF',
  },
  {
    icon: Timer,
    title: 'Low Latency',
    desc: 'Sub-50ms response times ensuring seamless, uninterrupted conversation.',
    glow: 'purple',
    accent: '#9D4EDD',
  },
  {
    icon: Target,
    title: 'High Accuracy',
    desc: 'Trained on a proprietary dataset of over 10 million nuanced gestures.',
    glow: 'cyan',
    accent: '#00D2FF',
  },
  {
    icon: Cpu,
    title: 'Edge Computing',
    desc: 'Neural inference runs directly in the browser — no server round-trips required.',
    glow: 'purple',
    accent: '#9D4EDD',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 relative"
    >
      {/* Background hint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(103,80,164,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="page-wrapper relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            className="font-mono-label mb-3"
            style={{ color: 'var(--neon-cyan)' }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            NEURAL ARCHITECTURE
          </motion.p>
          <motion.h2
            id="features-heading"
            className="text-display-sm text-[var(--on-surface)] mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Built for{' '}
            <span className="text-gradient-cyan">precision, speed</span>
            <br />
            and absolute privacy.
          </motion.h2>
          <motion.p
            className="text-body-md text-[var(--on-surface-variant)] max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Every component is designed to operate at the intersection of
            human communication and machine intelligence.
          </motion.p>
        </div>

        {/* Feature grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div key={feat.title} variants={cardVariants}>
                <GlassCard
                  glow={feat.glow}
                  animate={false}
                  className="p-7 h-full flex flex-col gap-5 cursor-default"
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${feat.accent}12`,
                      border: `1px solid ${feat.accent}30`,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: feat.accent }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text */}
                  <div>
                    <h3
                      className="font-sans font-semibold text-[var(--on-surface)] mb-2"
                      style={{ fontSize: '1rem' }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[var(--on-surface-variant)] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  {/* Bottom glow line */}
                  <div
                    className="mt-auto h-px w-full opacity-30"
                    style={{
                      background: `linear-gradient(to right, transparent, ${feat.accent}, transparent)`,
                    }}
                  />
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
