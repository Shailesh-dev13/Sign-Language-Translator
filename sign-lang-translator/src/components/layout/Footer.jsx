// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

const FOOTER_LINKS = {
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
  Connect: [
    { label: 'API Documentation', to: '/docs' },
    { label: 'Contact Support', to: '/support' },
  ],
  Product: [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Dictionary', to: '/dictionary' },
    { label: 'Learning', to: '/learning' },
  ],
};

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--surface-lowest)',
      }}
    >
      <div className="page-wrapper">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline mb-4"
              aria-label="Signa AI home"
            >
              <Logo size={24} />
              <span className="text-gradient-cyan font-sans font-bold text-base tracking-tight">
                Signa AI
              </span>
            </Link>
            <p className="text-[var(--on-surface-variant)] text-sm leading-relaxed max-w-xs">
              Breaking communication barriers through cinematic AI-powered sign language translation.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-mono-label text-[var(--on-surface)] uppercase tracking-widest mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <hr className="laser-divider" />
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono-label text-[var(--on-surface-variant)] text-xs">
            © 2026 Signa AI. Cinematic Futurism Interface.
          </p>
          <p
            className="font-mono-label text-xs"
            style={{ color: 'var(--neon-cyan)', opacity: 0.6 }}
          >
            ALL SYSTEMS NOMINAL
          </p>
        </div>
      </div>
    </footer>
  );
}
