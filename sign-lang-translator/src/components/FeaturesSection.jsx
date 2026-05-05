// src/components/FeaturesSection.jsx

import { motion } from "framer-motion";
import { Zap, Target, Shield, Monitor, Hand, Globe, Brain, Sparkles } from "lucide-react";
import { RangoliDivider } from "./IndianDecorations";

const FEATURES = [
  { icon: Zap, title: "Real-Time Translation", desc: "Convert Indian Sign Language to text instantly with minimal latency.", color: "#FF9933" },
  { icon: Target, title: "High Accuracy", desc: "Advanced AI ensuring precise and accurate gesture recognition.", color: "#FFD54F" },
  { icon: Zap, title: "Lightning Fast", desc: "Lightning-fast translations for seamless daily communication.", color: "#FBBF24" },
  { icon: Shield, title: "Privacy First", desc: "Your data is protected with enterprise-grade, on-device security protocols.", color: "#10B981" },
  { icon: Monitor, title: "Accessible Design", desc: "An intuitive, accessible design built for absolutely everyone.", color: "#F43F5E" },
  { icon: Hand, title: "Full ISL Support", desc: "Comprehensive support for both individual alphabets and complete words in ISL.", color: "#F97316" },
  { icon: Globe, title: "No Installation", desc: "No app installation required. Access directly through your browser.", color: "#14B8A6" },
  { icon: Brain, title: "ML Powered", desc: "Cutting-edge machine learning models for superior sign recognition.", color: "#EAB308" },
  { icon: Sparkles, title: "Visual Feedback", desc: "Immediate visual feedback for truly spontaneous and dynamic interactions.", color: "#FB923C" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: "6rem 2rem",
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
        style={{ textAlign: "center", marginBottom: "4rem" }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "0.75rem",
          }}
        >
          Why Choose{" "}
          <span className="text-gradient-primary">Mudrā</span>?
        </h2>
        <div className="section-sep" />
        <div style={{ maxWidth: "440px", margin: "0 auto 0.75rem" }}>
          <RangoliDivider color="#FF9933" opacity={0.3} />
        </div>
        <p style={{ fontSize: "15px", color: "#8A7968", maxWidth: "600px", margin: "0 auto" }}>
          Experience the next generation of accessibility features designed for seamless and instant interaction.
        </p>
      </motion.div>

      {/* Features grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {FEATURES.map((feat) => (
          <motion.div
            key={feat.title}
            variants={cardVariants}
            className="glass-card"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: `${feat.color}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <feat.icon size={20} color={feat.color} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FAF7F2" }}>
              {feat.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#8A7968", lineHeight: 1.6 }}>
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
