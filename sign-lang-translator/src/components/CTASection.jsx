// src/components/CTASection.jsx

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      style={{
        padding: "6rem 2rem",
        maxWidth: "1280px",
        margin: "0 auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(255,153,51,0.1), rgba(255,213,79,0.08), rgba(249,115,22,0.05))",
          border: "1px solid rgba(255,153,51,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,153,51,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <h2
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          Experience{" "}
          <span className="text-gradient-primary">Mudrā</span> Now
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#9CA3AF",
            maxWidth: "600px",
            margin: "0 auto 2rem",
            lineHeight: 1.7,
            position: "relative",
          }}
        >
          Join thousands of users who are already breaking communication barriers
          with our real-time AI-powered ISL translation.
        </p>
        <a
          href="#translate"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px 32px",
            background: "linear-gradient(135deg, #FF9933, #FFD54F)",
            color: "#18181b",
            fontWeight: 700,
            fontSize: "16px",
            borderRadius: "14px",
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(255,153,51,0.3)",
            transition: "all 0.3s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,153,51,0.5)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,153,51,0.3)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Start Translating Instantly
          <ArrowRight size={18} />
        </a>
        <p
          style={{
            fontSize: "13px",
            color: "#6B7280",
            marginTop: "1rem",
            position: "relative",
          }}
        >
          No signup. Works directly in your browser.
        </p>
      </motion.div>
    </section>
  );
}
