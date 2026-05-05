// src/components/HowItWorks.jsx

import { motion } from "framer-motion";
import { Camera, Cpu, Type, Lock } from "lucide-react";

const STEPS = [
  {
    icon: Camera,
    step: "01",
    title: "Capture Gestures",
    desc: "Mudrā uses advanced computer vision to detect and track hand gestures through your device's camera.",
    color: "#FF9933",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Processing",
    desc: "Each frame is processed in real time using trained deep learning models that recognize Indian Sign Language alphabets and words.",
    color: "#FFD54F",
  },
  {
    icon: Type,
    step: "03",
    title: "Text Conversion",
    desc: "The detected gestures are then converted into text instantly, allowing seamless communication without delays.",
    color: "#F97316",
  },
  {
    icon: Lock,
    step: "04",
    title: "Privacy Guaranteed",
    desc: "Since all processing happens locally in the browser, your data remains completely private and secure.",
    color: "#10B981",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
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
            marginBottom: "1rem",
          }}
        >
          How Does{" "}
          <span className="text-gradient-primary">Mudrā</span> Work?
        </h2>
      </motion.div>

      {/* Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.step}
            className="glass-card"
            style={{
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              textAlign: "center",
              alignItems: "center",
              position: "relative",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {/* Step number */}
            <span
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: `${s.color}15`,
                position: "absolute",
                top: "12px",
                right: "18px",
                lineHeight: 1,
              }}
            >
              {s.step}
            </span>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "14px",
                background: `${s.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <s.icon size={26} color={s.color} strokeWidth={1.8} />
            </div>

            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#F9FAFB" }}>
              {s.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.6 }}>
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
