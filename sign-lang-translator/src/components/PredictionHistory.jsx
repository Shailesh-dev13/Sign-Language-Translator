// src/components/PredictionHistory.jsx

import { motion, AnimatePresence } from "framer-motion";
import { History } from "lucide-react";

export default function PredictionHistory({ letters }) {
  // Show last 12 letters
  const recent = letters.slice(-12).reverse();

  return (
    <motion.div
      className="glass-card"
      style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "8px",
            background: "rgba(255,153,51,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <History size={14} color="#FF9933" />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#fdfaf6" }}>
          Recent Detections
        </span>
        {letters.length > 0 && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              fontFamily: "JetBrains Mono, monospace",
              color: "#6b7280",
            }}
          >
            {letters.length} total
          </span>
        )}
      </div>

      {/* History grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", minHeight: "40px" }}>
        {recent.length === 0 ? (
          <span
            style={{
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
              color: "#6b7280",
            }}
          >
            No detections yet...
          </span>
        ) : (
          <AnimatePresence>
            {recent.map(({ id, letter }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1 - i * 0.06, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background:
                    i === 0
                      ? "rgba(255,153,51,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    i === 0
                      ? "1px solid rgba(255,153,51,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: i === 0 ? "#FF9933" : "#9ca3af",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {letter}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
