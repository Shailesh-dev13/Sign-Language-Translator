// src/App.jsx

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Volume2, Square } from "lucide-react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import TranslatorView from "./components/TranslatorView";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function App() {
  const [letters, setLetters] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleNewLetter = useCallback((letter) => {
    setLetters((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), letter },
    ]);
  }, []);

  const translationString = letters.map((l) => l.letter).join("");

  const handleClear = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setLetters([]);
  };

  const handleSpeak = () => {
    if (!translationString) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translationString);
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

  return (
    <div style={{ minHeight: "100vh", background: "#0c0a08" }}>
      <Navbar />

      {/* ─── Hero Section ─── */}
      <HeroSection />

      {/* ─── Translate Section ─── */}
      <section
        id="translate"
        style={{
          padding: "4rem 2rem 6rem",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "0.5rem",
            }}
          >
            Live{" "}
            <span className="text-gradient-primary">ISL Translator</span>
          </h2>
          <p
            className="font-devanagari"
            style={{ fontSize: "13px", color: "rgba(255,153,51,0.5)", marginBottom: "0.5rem" }}
          >
            सांकेतिक भाषा से पाठ — वास्तविक समय में
          </p>
          <p style={{ fontSize: "15px", color: "#9CA3AF", maxWidth: "500px", margin: "0 auto" }}>
            Show a sign to the camera — predictions appear in real time
          </p>
        </motion.div>

        {/* Two-column layout: Camera + Translation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* Left — Camera */}
          <TranslatorView onNewLetter={handleNewLetter} />

          {/* Right — Translation panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Current Detection */}
            <motion.div
              className="glass-card"
              style={{ padding: "20px", textAlign: "center" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#F9FAFB", marginBottom: "12px" }}>
                Current Detection
              </h3>
              <AnimatePresence mode="wait">
                {letters.length > 0 ? (
                  <motion.div
                    key={letters[letters.length - 1]?.letter}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      fontSize: "48px",
                      fontWeight: 800,
                      color: "#F9FAFB",
                      textShadow: "0 0 30px rgba(255,153,51,0.4)",
                    }}
                  >
                    {letters[letters.length - 1]?.letter}
                  </motion.div>
                ) : (
                  <motion.p
                    key="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: "16px", fontWeight: 600, color: "#6B7280" }}
                  >
                    No sign detected
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Translation box */}
            <motion.div
              className="glass-card"
              style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#F9FAFB" }}>
                Translation
              </h3>

              {/* Text area */}
              <div
                style={{
                  minHeight: "100px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  padding: "14px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {translationString ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", alignItems: "center" }}>
                    <AnimatePresence>
                      {letters.map(({ id, letter }) => (
                        <motion.span
                          key={id}
                          initial={{ opacity: 0, y: 8, scale: 0.7 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "#F9FAFB",
                            lineHeight: 1.3,
                          }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    {/* Blinking cursor */}
                    <motion.span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "22px",
                        background: "#FF9933",
                        borderRadius: "1px",
                        marginLeft: "2px",
                      }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "steps(1)" }}
                    />
                  </div>
                ) : (
                  <p style={{ color: "#6B7280", fontSize: "14px" }}>
                    Translation will appear here...
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                {/* Stop / Speak */}
                {isSpeaking ? (
                  <button
                    onClick={handleStop}
                    style={{
                      flex: 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      padding: "10px",
                      borderRadius: "10px",
                      background: "#EF4444",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "13px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Square size={14} />
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={handleSpeak}
                    disabled={!translationString}
                    style={{
                      flex: 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      padding: "10px",
                      borderRadius: "10px",
                      background: translationString
                        ? "linear-gradient(135deg, #FF9933, #FFD54F)"
                        : "rgba(255,255,255,0.05)",
                      color: translationString ? "#18181b" : "#6B7280",
                      fontWeight: 700,
                      fontSize: "13px",
                      border: "none",
                      cursor: translationString ? "pointer" : "not-allowed",
                      boxShadow: translationString ? "0 4px 16px rgba(255,153,51,0.25)" : "none",
                    }}
                  >
                    <Volume2 size={14} />
                    Speak
                  </button>
                )}

                {/* Clear */}
                <button
                  onClick={handleClear}
                  disabled={!translationString}
                  style={{
                    flex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: translationString ? "#9CA3AF" : "#4B5563",
                    fontWeight: 500,
                    fontSize: "13px",
                    cursor: translationString ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                  }}
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              </div>

              {/* Detected Signs list */}
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 600, color: "#F9FAFB", marginBottom: "8px" }}>
                  Detected Signs:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {letters.length === 0 ? (
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>
                      No signs detected yet
                    </span>
                  ) : (
                    letters.slice(-20).map(({ id, letter }, i) => (
                      <motion.span
                        key={id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "6px",
                          background:
                            i === letters.slice(-20).length - 1
                              ? "rgba(255,153,51,0.2)"
                              : "rgba(255,255,255,0.04)",
                          border:
                            i === letters.slice(-20).length - 1
                              ? "1px solid rgba(255,153,51,0.4)"
                              : "1px solid rgba(255,255,255,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 600,
                          color:
                            i === letters.slice(-20).length - 1
                              ? "#FF9933"
                              : "#9CA3AF",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <FeaturesSection />

      {/* ─── How It Works ─── */}
      <HowItWorks />

      {/* ─── CTA ─── */}
      <CTASection />

      {/* ─── Footer ─── */}
      <Footer />
    </div>
  );
}
