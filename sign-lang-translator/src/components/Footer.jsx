// src/components/Footer.jsx

import { motion } from "framer-motion";
import { Heart, ExternalLink, Mail, MapPin } from "lucide-react";
import { TricolorBar, RangoliDivider } from "./IndianDecorations";

const PRODUCT_LINKS = [
  { label: "Live Translator (Sign to Text)", href: "#translate" },
  { label: "ISL Dictionary", href: "#" },
  { label: "Research Models", href: "#" },
  { label: "How it Works", href: "#how-it-works" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Blog & Updates", href: "#" },
  { label: "Project Gallery", href: "#" },
];

const LINK_STYLE = {
  fontSize: "14px",
  color: "#8A7968",
  textDecoration: "none",
  transition: "color 0.2s",
};

export default function Footer() {
  return (
    <motion.footer
      id="about"
      style={{
        background: "rgba(16, 12, 9, 0.7)",
        marginTop: "2rem",
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Indian tricolor stripe at top */}
      <TricolorBar height={4} opacity={0.85} />

      {/* Rangoli divider below stripe */}
      <div style={{ padding: "1.25rem 2rem 0", maxWidth: "900px", margin: "0 auto" }}>
        <RangoliDivider color="#FF9933" opacity={0.25} />
      </div>

      {/* Main footer grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 2rem",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1.5fr",
          gap: "3rem",
        }}
      >
        {/* ── Brand column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🪷</span>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  background: "linear-gradient(135deg, #FF9933, #FFD54F)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MUDRĀ
              </span>
              <span
                className="font-devanagari"
                style={{ fontSize: "11px", color: "rgba(255,153,51,0.5)", display: "block", marginTop: "1px" }}
              >
                मुद्रा
              </span>
            </div>
          </div>

          <p style={{ fontSize: "13.5px", color: "#8A7968", lineHeight: 1.75, maxWidth: "300px" }}>
            Breaking communication barriers for India's deaf community with
            advanced, privacy-first Indian Sign Language AI.
          </p>

          {/* India badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,153,51,0.07)",
              border: "1px solid rgba(255,153,51,0.15)",
              borderRadius: "8px",
              padding: "5px 12px",
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: "14px" }}>🇮🇳</span>
            <span style={{ fontSize: "11.5px", color: "#FF9933", fontWeight: 600 }}>
              Made with pride in India
            </span>
          </div>

          {/* Social */}
          <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
            {["GitHub", "Twitter"].map((social) => (
              <a
                key={social}
                href="#"
                style={{
                  height: 32, padding: "0 12px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,153,51,0.1)",
                  display: "flex", alignItems: "center",
                  color: "#8A7968", textDecoration: "none",
                  fontSize: "12px", fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,153,51,0.35)";
                  e.currentTarget.style.color = "#FF9933";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,153,51,0.1)";
                  e.currentTarget.style.color = "#8A7968";
                }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* ── Product column ── */}
        <div>
          <h4
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#FF9933",
              marginBottom: "18px",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <span>✦</span> Product
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
            {PRODUCT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={LINK_STYLE}
                onMouseEnter={(e) => (e.target.style.color = "#FAF7F2")}
                onMouseLeave={(e) => (e.target.style.color = "#8A7968")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Company column ── */}
        <div>
          <h4
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#FF9933",
              marginBottom: "18px",
            }}
          >
            Company
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
            {COMPANY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={LINK_STYLE}
                onMouseEnter={(e) => (e.target.style.color = "#FAF7F2")}
                onMouseLeave={(e) => (e.target.style.color = "#8A7968")}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Stay Updated column ── */}
        <div>
          <h4
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#FF9933",
              marginBottom: "18px",
            }}
          >
            Stay Updated
          </h4>
          <p style={{ fontSize: "13px", color: "#8A7968", marginBottom: "12px", lineHeight: 1.65 }}>
            Join our newsletter for ISL AI updates & beta access.
          </p>
          <div
            style={{
              display: "flex",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid rgba(255,153,51,0.18)",
            }}
          >
            <input
              type="email"
              placeholder="Enter email address"
              style={{
                flex: 1, padding: "10px 14px",
                background: "rgba(255,153,51,0.04)",
                border: "none", outline: "none",
                color: "#FAF7F2", fontSize: "13px",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              style={{
                padding: "10px 16px",
                background: "linear-gradient(135deg, #FF9933, #E8720C)",
                color: "#FAF7F2",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontSize: "15px",
                display: "flex", alignItems: "center",
              }}
            >
              →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#8A7968" }}>
              <Mail size={13} color="#FF9933" />
              contact@mudra.ai
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#8A7968" }}>
              <MapPin size={13} color="#FF9933" />
              Bhārat, India 🇮🇳
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,153,51,0.1)",
          paddingTop: "1.25rem",
          paddingBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "1.25rem 2rem 1.75rem",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "#8A7968",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          © 2026 Mudrā.{" "}
          <span style={{ fontFamily: "Tiro Devanagari Hindi, serif", color: "rgba(255,153,51,0.6)", fontSize: "12px" }}>
            भारत में निर्मित
          </span>{" "}
          with <Heart size={12} color="#EF4444" fill="#EF4444" /> for every voice.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#" style={{ fontSize: "12px", color: "#8A7968", textDecoration: "none" }}>
            Terms of Service
          </a>
          <a href="#" style={{ fontSize: "12px", color: "#8A7968", textDecoration: "none" }}>
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Tricolor bottom bar */}
      <TricolorBar height={3} opacity={0.7} />
    </motion.footer>
  );
}
