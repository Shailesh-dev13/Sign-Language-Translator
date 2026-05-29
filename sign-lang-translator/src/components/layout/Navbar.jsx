// src/components/layout/Navbar.jsx — Enhanced with animated active indicator and improved UX
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import Logo from '../ui/Logo';
import StatusDot from '../ui/StatusDot';
import GlowButton from '../ui/GlowButton';

const NAV_LINKS = [
  { label: 'Dashboard',  to: '/dashboard' },
  { label: 'Dictionary', to: '/dictionary' },
  { label: 'Learning',   to: '/learning' },
  { label: 'Community',  to: '/community' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const linkRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Update the sliding indicator position when active link changes
  const updateIndicator = (i) => {
    const el = linkRefs.current[i];
    if (!el) return;
    const { offsetLeft, offsetWidth } = el;
    setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
  };

  useEffect(() => {
    if (activeIndex >= 0) updateIndicator(activeIndex);
  }, [activeIndex]);

  return (
    <>
      <motion.header
        role="banner"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(9, 8, 15, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <div className="page-wrapper">
          <nav className="flex items-center justify-between h-16 md:h-18" aria-label="Main navigation">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2.5 no-underline" aria-label="Signa AI home">
              <Logo size={28} />
              <span
                className="text-gradient-cyan font-bold text-lg tracking-tight"
                style={{ fontFamily: 'Orbitron, Inter, sans-serif', letterSpacing: '0.05em', fontSize: 17 }}
              >
                SIGNA AI
              </span>
            </Link>

            {/* Desktop nav with sliding indicator */}
            <div className="hidden md:flex items-center gap-8 relative">
              {/* Sliding active indicator */}
              {activeIndex >= 0 && (
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    height: 1.5,
                    background: 'linear-gradient(to right, var(--neon-cyan), var(--neon-purple))',
                    borderRadius: 1,
                    ...indicatorStyle,
                  }}
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {NAV_LINKS.map((link, i) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  ref={(el) => { linkRefs.current[i] = el; }}
                  className={({ isActive }) => {
                    if (isActive && activeIndex !== i) {
                      setActiveIndex(i);
                      setTimeout(() => updateIndicator(i), 0);
                    }
                    return `nav-link ${isActive ? 'active' : ''}`;
                  }}
                  style={{ position: 'relative' }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Zap size={10} style={{ color: 'var(--neon-cyan)' }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--neon-cyan)', letterSpacing: '0.08em' }}>
                  LIVE
                </span>
              </div>
              <StatusDot status="active" label="SYSTEM ONLINE" />
              <GlowButton
                size="sm"
                onClick={() => navigate('/dashboard')}
                aria-label="Launch Signa AI dashboard"
              >
                Launch App
              </GlowButton>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--on-surface-variant)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.div key="x"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={20} /></motion.div>
                  : <motion.div key="m"  initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={20} /></motion.div>
                }
              </AnimatePresence>
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-40 flex flex-col pt-16"
            style={{ background: 'rgba(9, 8, 15, 0.97)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Background accent in drawer */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,229,255,0.04), transparent)' }} />

            <div className="flex flex-col gap-2 p-6 relative">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block py-3.5 px-5 rounded-xl font-mono-label text-sm transition-all ${
                        isActive
                          ? 'text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.15)]'
                          : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] bg-[rgba(255,255,255,0.02)] border border-transparent'
                      }`
                    }
                    onClick={() => setMobileOpen(false)}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <hr className="laser-divider my-4" />
              <StatusDot status="active" label="SYSTEM ONLINE" className="px-4" />
              <GlowButton
                className="mt-4 w-full"
                size="md"
                onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                aria-label="Launch app"
              >
                Launch App
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
