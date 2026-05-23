// src/pages/DashboardPage.jsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings, History, HelpCircle } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import StatusDot from '../components/ui/StatusDot';
import TranslationPanel from '../components/dashboard/TranslationPanel';
import TranslatorView from '../components/TranslatorView';

export default function DashboardPage() {
  const [letters, setLetters] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Backend sends ASL signs (e.g. "A", "B") — treat each as a token
  const handleNewLetter = useCallback((word, conf = 0.85) => {
    setLetters((prev) => {
      // Add a space separator between words
      const spacer = prev.length > 0
        ? [{ id: Date.now() + Math.random() - 1, letter: ' ' }]
        : [];
      return [
        ...prev,
        ...spacer,
        { id: Date.now() + Math.random(), letter: word },
      ];
    });
    setConfidence(conf);
  }, []);

  const handleSpeak = () => {
    const text = letters.map((l) => l.letter).join('');
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleClear = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setLetters([]);
    setConfidence(0);
  };

  const NAV_ACTIONS = [
    { icon: Settings, label: 'Settings', id: 'dash-settings' },
    { icon: History, label: 'History', id: 'dash-history' },
    { icon: HelpCircle, label: 'Help', id: 'dash-help' },
  ];

  return (
    <main
      id="main-content"
      className="min-h-screen pt-20 pb-12"
      aria-label="Signa AI Translator Dashboard"
    >
      <div className="page-wrapper">
        {/* ── Dashboard header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-display-sm text-[var(--on-surface)] mb-1">
              Live Translation
            </h1>
            <p className="font-mono-label text-[var(--on-surface-variant)]">
              ASL → Text in real-time
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <StatusDot status="active" label="MODEL ACTIVE" />
            {NAV_ACTIONS.map(({ icon: Icon, label, id }) => (
              <GlowButton
                key={id}
                id={id}
                variant="ghost"
                size="sm"
                aria-label={label}
                className="!px-3 !py-2"
              >
                <Icon size={15} aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </GlowButton>
            ))}
          </motion.div>
        </div>

        <hr className="laser-divider mb-8" aria-hidden="true" />

        {/* ── Main grid: camera + panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
          {/* Camera feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard animate={false} glow="cyan" className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusDot status="active" />
                  <span className="font-mono-label text-[var(--on-surface-variant)] uppercase">
                    Camera Feed
                  </span>
                </div>
                <span className="font-mono-label text-xs" style={{ color: 'rgba(0,210,255,0.7)' }}>
                  TRACKING ACTIVE
                </span>
              </div>

              {/* Corner bracket framing */}
              <div className="relative rounded-xl overflow-hidden">
                {/* Brackets */}
                {[
                  'top-2 left-2 border-t-2 border-l-2 rounded-tl-md',
                  'top-2 right-2 border-t-2 border-r-2 rounded-tr-md',
                  'bottom-2 left-2 border-b-2 border-l-2 rounded-bl-md',
                  'bottom-2 right-2 border-b-2 border-r-2 rounded-br-md',
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute ${cls} w-5 h-5 z-10 pointer-events-none`}
                    style={{ borderColor: 'rgba(0,210,255,0.5)' }}
                    aria-hidden="true"
                  />
                ))}
                <TranslatorView onNewLetter={handleNewLetter} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Translation panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TranslationPanel
              letters={letters}
              confidence={confidence}
              isSpeaking={isSpeaking}
              onSpeak={handleSpeak}
              onStop={handleStop}
              onClear={handleClear}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
