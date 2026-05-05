// src/components/StatsPanel.jsx

import { motion } from "framer-motion";
import { Eye, Zap, Clock, Target } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function StatsPanel({ lettersCount, sessionSeconds }) {
  const minutes = Math.floor(sessionSeconds / 60);
  const secs = sessionSeconds % 60;

  const stats = [
    {
      icon: Eye,
      label: "Signs Detected",
      value: lettersCount,
      color: "#FF9933",
      bg: "rgba(255,153,51,0.1)",
    },
    {
      icon: Target,
      label: "Avg. Confidence",
      value: lettersCount > 0 ? "92%" : "—",
      color: "#1DB954",
      bg: "rgba(29,185,84,0.1)",
    },
    {
      icon: Zap,
      label: "Detection Speed",
      value: "500ms",
      color: "#FFD54F",
      bg: "rgba(255,213,79,0.1)",
    },
    {
      icon: Clock,
      label: "Session Time",
      value: `${minutes}:${secs.toString().padStart(2, "0")}`,
      color: "#60A5FA",
      bg: "rgba(96,165,250,0.1)",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", width: "100%" }}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={cardVariants}
          className="glass-card glass-card-hover"
          style={{
            padding: "1rem 1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            cursor: "default",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <stat.icon size={16} color={stat.color} strokeWidth={2} />
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "#fdfaf6",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "JetBrains Mono, monospace",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "2px",
              }}
            >
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
