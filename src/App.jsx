// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';

/**
 * Root application shell — handles routing between landing page
 * and the translator dashboard. Navbar + Footer persist across all routes.
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

      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dictionary" element={<PlaceholderPage />} />
            <Route path="/learning" element={<PlaceholderPage />} />
            <Route path="/community" element={<PlaceholderPage />} />
            <Route path="/privacy" element={<PlaceholderPage />} />
            <Route path="/terms" element={<PlaceholderPage />} />
            <Route path="/docs" element={<PlaceholderPage />} />
            <Route path="/support" element={<PlaceholderPage />} />
            {/* Catch-all */}
            <Route path="*" element={<PlaceholderPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
