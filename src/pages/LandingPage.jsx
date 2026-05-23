// src/pages/LandingPage.jsx
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import CTASection from '../components/sections/CTASection';

export default function LandingPage() {
  return (
    <main id="main-content">
      <HeroSection />
      <hr className="laser-divider mx-auto" style={{ maxWidth: '1200px' }} aria-hidden="true" />
      <FeaturesSection />
      <hr className="laser-divider mx-auto" style={{ maxWidth: '1200px' }} aria-hidden="true" />
      <CTASection />
    </main>
  );
}
