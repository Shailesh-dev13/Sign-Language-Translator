// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import StatusDot from '../ui/StatusDot';
import GlowButton from '../ui/GlowButton';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Dictionary', to: '/dictionary' },
  { label: 'Learning', to: '/learning' },
  { label: 'Community', to: '/community' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        role="banner"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(20, 18, 24, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="page-wrapper">
          <nav
            className="flex items-center justify-between h-16 md:h-18"
            aria-label="Main navigation"
          >
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline"
              aria-label="Signa AI home"
            >
              <Logo size={28} />
              <span
                className="text-gradient-cyan font-sans font-bold text-lg tracking-tight"
              >
                Signa AI
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-4">
              <StatusDot status="active" label="SYSTEM ONLINE" />
              <GlowButton
                size="sm"
                onClick={() => {}}
                aria-label="Launch Signa AI dashboard"
              >
                Launch App
              </GlowButton>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
            style={{ background: 'rgba(15, 13, 19, 0.97)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex flex-col gap-2 p-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block py-3 px-4 rounded-lg font-mono-label text-sm transition-colors ${
                        isActive
                          ? 'text-[var(--on-surface)] bg-white/5'
                          : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'
                      }`
                    }
                    onClick={() => setMobileOpen(false)}
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
