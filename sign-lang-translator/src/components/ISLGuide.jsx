// src/components/ISLGuide.jsx

import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";

const ISL_SIGNS = [
  "A","B","C","D","E","F","G","H","I","J",
  "K","L","M","N","O","P","Q","R","S","T",
  "U","V","W","X","Y","Z",
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export default function ISLGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="glass-card"
      style={{
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setExpanded((p) => !p)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: "rgba(19,136,8,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={14} color="#1DB954" />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#fdfaf6" }}>
            ISL Alphabet Reference
          </span>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "JetBrains Mono, monospace",
              color: "#1DB954",
              background: "rgba(29,185,84,0.1)",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            26 Signs
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} color="#6b7280" />
        </motion.div>
      </div>

      {/* Expandable grid */}
      <motion.div
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        initial={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={expanded ? "show" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
            gap: "8px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}
        >
          {ISL_SIGNS.map((sign) => (
            <motion.div
              key={sign}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                borderColor: "rgba(255,153,51,0.4)",
                background: "rgba(255,153,51,0.1)",
              }}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 600,
                color: "#fdfaf6",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {sign}
            </motion.div>
          ))}
        </motion.div>

        <p
          style={{
            fontSize: "11px",
            fontFamily: "JetBrains Mono, monospace",
            color: "#6b7280",
            marginTop: "12px",
            lineHeight: 1.6,
          }}
        >
          Indian Sign Language (ISL) is used by approximately 1.8 million deaf
          individuals across India. Unlike ASL, ISL has its own unique grammar
          and vocabulary rooted in Indian culture.
        </p>
      </motion.div>
    </motion.div>
  );
}
