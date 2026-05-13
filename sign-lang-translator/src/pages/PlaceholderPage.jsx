// src/pages/PlaceholderPage.jsx
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import GlowButton from '../components/ui/GlowButton';
import StatusDot from '../components/ui/StatusDot';

/**
 * Generic placeholder for routes not yet implemented.
 * Shows page name, status, and a back CTA.
 */
export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const name = pathname.replace('/', '').replace(/-/g, ' ') || 'Page';

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center pt-16 pb-20 text-center"
      aria-label={`${name} page`}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(103,80,164,0.08) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="page-wrapper flex flex-col items-center gap-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatusDot status="idle" label="MODULE NOT YET DEPLOYED" />

        <h1 className="text-display-sm text-[var(--on-surface)] capitalize">
          {name}
        </h1>
        <p className="text-body-md text-[var(--on-surface-variant)] max-w-md">
          This section of the Signa AI interface is currently under construction.
          The neural networks are being calibrated for maximum performance.
        </p>

        <div
          className="font-mono-code text-sm px-6 py-4 rounded-xl"
          style={{
            background: 'rgba(0,210,255,0.04)',
            border: '1px solid rgba(0,210,255,0.15)',
            color: 'var(--neon-cyan)',
          }}
          role="note"
        >
          // COMING SOON — ROUTE: {pathname}
        </div>

        <Link to="/" tabIndex={-1}>
          <GlowButton size="md" aria-label="Return to home page">
            Return to Base
          </GlowButton>
        </Link>
      </motion.div>
    </main>
  );
}
