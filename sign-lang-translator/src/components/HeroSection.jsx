// src/components/HeroSection.jsx

import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { MandalaOrb, RangoliDivider, RangoliDots } from "./IndianDecorations";

const STATS = [
  { label: "ISL Signs Supported", value: "26+", emoji: "🤚" },
  { label: "Detection Speed", value: "<1s", emoji: "⚡" },
  { label: "Privacy Guaranteed", value: "100%", emoji: "🔒" },
  { label: "Made in India", value: "🇮🇳", emoji: "" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8rem 2rem 5rem",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* ── Background layer ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Warm saffron orb — left */}
        <div
          className="animate-float"
          style={{
            position: "absolute", top: "8%", left: "8%",
            width: 560, height: 560, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,153,51,0.13) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        {/* Gold orb — right */}
        <div
          className="animate-float-delay"
          style={{
            position: "absolute", bottom: "5%", right: "5%",
            width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,213,79,0.10) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Green orb — center-right */}
        <div
          className="animate-float-slow"
          style={{
            position: "absolute", top: "45%", right: "25%",
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(19,136,8,0.07) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Rangoli grid */}
        <div className="bg-rangoli-dots" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

        {/* Mandala top-right */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px" }}>
          <div className="animate-spin-slow" style={{ opacity: 0.07 }}>
            <MandalaOrb size={400} opacity={1} animate={false} />
          </div>
        </div>
        {/* Mandala bottom-left — counter-rotate */}
        <div style={{ position: "absolute", bottom: "-100px", left: "-100px" }}>
          <div className="animate-spin-reverse" style={{ opacity: 0.05 }}>
            <MandalaOrb size={360} opacity={1} animate={false} />
          </div>
        </div>
      </div>

      {/* ── Content ── */}

      {/* Privacy badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(19,136,8,0.08)",
          border: "1px solid rgba(19,136,8,0.2)",
          borderRadius: "24px", padding: "6px 18px",
          marginBottom: "6px",
          position: "relative", zIndex: 1,
        }}
      >
        <Shield size={13} color="#22C55E" />
        <span style={{ fontSize: "12.5px", fontWeight: 500, color: "#22C55E" }}>
          Local AI Processing
        </span>
        <span style={{ fontSize: "11px", color: "#8A7968" }}>· No backend servers</span>
      </motion.div>

      {/* Devanagari sub-label */}
      <motion.p
        className="font-devanagari"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "15px",
          color: "rgba(255,153,51,0.55)",
          letterSpacing: "0.05em",
          marginBottom: "1.2rem",
          position: "relative", zIndex: 1,
        }}
      >
        मुद्रा — भारतीय सांकेतिक भाषा अनुवादक
      </motion.p>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.25 }}
        style={{
          fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-2px",
          maxWidth: "920px",
          position: "relative", zIndex: 1,
        }}
      >
        Convert{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #FF9933 30%, #FFD54F 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Indian Sign Language
        </span>
        {" "}To Text,{" "}
        <span className="shimmer-text">
          In Real Time
        </span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          fontSize: "16px",
          color: "#D4C9B8",
          maxWidth: "660px",
          lineHeight: 1.75,
          margin: "1.5rem 0 0.5rem",
          position: "relative", zIndex: 1,
        }}
      >
        Bridging the communication gap for India's{" "}
        <span style={{ color: "#FF9933", fontWeight: 600 }}>5 million+</span> deaf community
        using on-device AI — completely{" "}
        <span style={{ color: "#22C55E", fontWeight: 600 }}>private</span> and{" "}
        <span style={{ color: "#FF9933", fontWeight: 600 }}>free</span>.
      </motion.p>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          fontSize: "13px",
          fontStyle: "italic",
          color: "#8A7968",
          marginBottom: "2rem",
          position: "relative", zIndex: 1,
        }}
      >
        ✦ A Small Step by India, A Giant Leap in Inclusive AI ✦
      </motion.p>

      {/* Rangoli divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        style={{ width: "100%", maxWidth: "500px", marginBottom: "2rem", position: "relative", zIndex: 1 }}
      >
        <RangoliDivider color="#FF9933" opacity={0.4} />
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ display: "flex", gap: "14px", position: "relative", zIndex: 1, flexWrap: "wrap", justifyContent: "center" }}
      >
        <a
          href="#translate"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 30px",
            background: "linear-gradient(135deg, #FF9933, #E8720C)",
            color: "#FAF7F2", fontWeight: 700, fontSize: "15px",
            borderRadius: "12px", textDecoration: "none",
            boxShadow: "0 8px 32px rgba(255,153,51,0.35), 0 0 0 1px rgba(255,213,79,0.15)",
            transition: "all 0.3s ease",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 14px 44px rgba(255,153,51,0.5), 0 0 0 1px rgba(255,213,79,0.25)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,153,51,0.35), 0 0 0 1px rgba(255,213,79,0.15)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          🤚 Start Translating Now
          <ArrowRight size={16} />
        </a>
        <a
          href="#features"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 28px",
            background: "rgba(255,153,51,0.06)",
            color: "#D4C9B8", fontWeight: 500, fontSize: "15px",
            borderRadius: "12px", textDecoration: "none",
            border: "1px solid rgba(255,153,51,0.18)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,153,51,0.45)";
            e.currentTarget.style.color = "#FAF7F2";
            e.currentTarget.style.background = "rgba(255,153,51,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,153,51,0.18)";
            e.currentTarget.style.color = "#D4C9B8";
            e.currentTarget.style.background = "rgba(255,153,51,0.06)";
          }}
        >
          Learn More
        </a>
      </motion.div>

      {/* Stats chips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        style={{
          display: "flex", gap: "12px", marginTop: "3rem",
          position: "relative", zIndex: 1, flexWrap: "wrap", justifyContent: "center",
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(26,23,20,0.7)",
              border: "1px solid rgba(255,153,51,0.12)",
              borderRadius: "10px", padding: "8px 16px",
              backdropFilter: "blur(12px)",
            }}
          >
            {s.emoji && <span style={{ fontSize: "16px" }}>{s.emoji}</span>}
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#FF9933" }}>{s.value}</span>
            <span style={{ fontSize: "12px", color: "#8A7968" }}>{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Rangoli dots — bottom decorative */}
      <div
        style={{
          position: "absolute", bottom: "30px", left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none", zIndex: 0,
        }}
      >
        <RangoliDots color="#FF9933" opacity={0.18} />
      </div>
    </section>
  );
}
