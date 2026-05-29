// src/main.jsx
import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'signa_loaded';

function Root() {
  const [loading, setLoading] = useState(() => {
    // Show loading screen once per browser session
    return !sessionStorage.getItem(SESSION_KEY);
  });

  const handleComplete = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setLoading(false);
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loader" onComplete={handleComplete} />
      ) : (
        <App key="app" />
      )}
    </AnimatePresence>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);