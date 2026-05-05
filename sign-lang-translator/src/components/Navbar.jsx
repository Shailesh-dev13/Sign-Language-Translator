// src/components/Navbar.jsx

import { motion } from "framer-motion";
import { useState } from "react";
import { TricolorBar } from "./IndianDecorations";

const NAV_LINKS = [
  { label: "Home",        href: "#home" },
  { label: "Translate",   href: "#translate" },
  { label: "Features",    href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About",       href: "#about" },
];

export default function Navbar() {
  const [active, setActive] = useState("Translate");

  return (
    <motion.header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: "rgba(12, 10, 8, 0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Indian tricolor top bar */}
      <TricolorBar height={3} opacity={0.9} />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a href="#home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Lotus icon */}
          <div style={{ fontSize: "20px", lineHeight: 1 }}>🪷</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                background: "linear-gradient(135deg, #FF9933, #FFD54F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Mudrā
            </span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: 500,
                color: "#8A7968",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: "1px",
              }}
            >
              Indian Sign Language
            </span>
          </div>
        </a>

        {/* Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: active === link.label ? "#FAF7F2" : "#8A7968",
                background: active === link.label ? "rgba(255,153,51,0.12)" : "transparent",
                border: active === link.label
                  ? "1px solid rgba(255,153,51,0.28)"
                  : "1px solid transparent",
                textDecoration: "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (active !== link.label) {
                  e.target.style.color = "#FAF7F2";
                  e.target.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (active !== link.label) {
                  e.target.style.color = "#8A7968";
                  e.target.style.background = "transparent";
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — status badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Made in India */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "rgba(255,153,51,0.08)",
              border: "1px solid rgba(255,153,51,0.15)",
              borderRadius: "20px", padding: "4px 12px",
            }}
          >
            <span style={{ fontSize: "13px" }}>🇮🇳</span>
            <span style={{ fontSize: "11px", color: "#FF9933", fontWeight: 600, letterSpacing: "0.05em" }}>
              Made in India
            </span>
          </div>

          {/* AI pill */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "rgba(19,136,8,0.08)",
              border: "1px solid rgba(19,136,8,0.2)",
              borderRadius: "20px", padding: "4px 12px",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#138808" }} />
            <span style={{
              fontSize: "11px", color: "#22C55E",
              fontFamily: "JetBrains Mono, monospace", fontWeight: 500,
            }}>
              Local AI
            </span>
          </div>
        </div>
      </div>

      {/* Bottom hairline in saffron */}
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,153,51,0.2), transparent)" }} />
    </motion.header>
  );
}
