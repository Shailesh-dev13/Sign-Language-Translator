// src/App.jsx — Updated with ParticleBackground, AnimatePresence routes, and new pages.
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ParticleBackground from './components/ui/ParticleBackground';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DictionaryPage from './pages/DictionaryPage';
import LearningPage from './pages/LearningPage';
import CommunityPage from './pages/CommunityPage';
import PlaceholderPage from './pages/PlaceholderPage';

/**
 * AnimatedRoutes — uses useLocation so AnimatePresence can detect route changes.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/dictionary" element={<DictionaryPage />} />
        <Route path="/learning"   element={<LearningPage />} />
        <Route path="/community"  element={<CommunityPage />} />
        <Route path="/privacy"    element={<PlaceholderPage />} />
        <Route path="/terms"      element={<PlaceholderPage />} />
        <Route path="/docs"       element={<PlaceholderPage />} />
        <Route path="/support"    element={<PlaceholderPage />} />
        {/* Catch-all */}
        <Route path="*"           element={<PlaceholderPage />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Root application shell.
 * ParticleBackground sits behind everything at z-0.
 * Navbar and Footer persist across all routes.
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:font-sans focus:font-semibold focus:text-sm"
        style={{ background: 'var(--neon-cyan)', color: '#000' }}
      >
        Skip to main content
      </a>

      {/* Animated particle neural network */}
      <ParticleBackground />

      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      <div className="flex flex-col min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <div className="flex-1">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
