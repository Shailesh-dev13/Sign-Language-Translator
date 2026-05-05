// src/components/IndianDecorations.jsx
// Reusable Indian cultural decorative elements

/** Tricolor horizontal bar — saffron / white / green */
export function TricolorBar({ height = 3, opacity = 1 }) {
  return (
    <div style={{ display: "flex", width: "100%", height, opacity }}>
      <div style={{ flex: 1, background: "#FF9933" }} />
      <div style={{ flex: 1, background: "#F9FAFB" }} />
      <div style={{ flex: 1, background: "#138808" }} />
    </div>
  );
}

/** Decorative section divider with Ashoka-wheel dot pattern */
export function RangoliDivider({ color = "#FF9933", opacity = 0.3 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", opacity, userSelect: "none" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${color})` }} />
      <span style={{ fontSize: "22px", color }}>✦</span>
      <span style={{ fontSize: "12px", color, letterSpacing: "6px" }}>❈ ❈ ❈</span>
      <span style={{ fontSize: "22px", color }}>✦</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}

/** Spinning mandala SVG ornament */
export function MandalaOrb({ size = 320, opacity = 0.06, animate = true }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        animation: animate ? "spin 60s linear infinite" : "none",
        opacity,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="96" stroke="#FF9933" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="80" stroke="#FF9933" strokeWidth="0.3" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="64" stroke="#FFD54F" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="48" stroke="#FF9933" strokeWidth="0.3" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="32" stroke="#138808" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="16" stroke="#FF9933" strokeWidth="0.5" />
        {/* Petals — 8 directions */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 20 * Math.cos(rad);
          const y1 = 100 + 20 * Math.sin(rad);
          const x2 = 100 + 90 * Math.cos(rad);
          const y2 = 100 + 90 * Math.sin(rad);
          return (
            <g key={angle}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF9933" strokeWidth="0.4" />
              <ellipse
                cx={100 + 55 * Math.cos(rad)}
                cy={100 + 55 * Math.sin(rad)}
                rx="12"
                ry="6"
                transform={`rotate(${angle} ${100 + 55 * Math.cos(rad)} ${100 + 55 * Math.sin(rad)})`}
                stroke="#FFD54F"
                strokeWidth="0.4"
              />
            </g>
          );
        })}
        {/* Inner lotus petals — 12 */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          return (
            <ellipse
              key={i}
              cx={100 + 26 * Math.cos(angle)}
              cy={100 + 26 * Math.sin(angle)}
              rx="8"
              ry="4"
              transform={`rotate(${i * 30} ${100 + 26 * Math.cos(angle)} ${100 + 26 * Math.sin(angle)})`}
              stroke="#138808"
              strokeWidth="0.3"
            />
          );
        })}
        {/* Center dot */}
        <circle cx="100" cy="100" r="3" fill="#FF9933" opacity="0.8" />
      </svg>
    </div>
  );
}

/** Small decorative lotus flower */
export function LotusIcon({ size = 24, color = "#FF9933" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2Z" stroke={color} strokeWidth="1" />
      <path d="M4 8C4 8 6 11 8 12.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M20 8C20 8 18 11 16 12.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M2 14C2 14 5 13 8 14.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M22 14C22 14 19 13 16 14.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M12 14V22" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M9 22H15" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/** Rangoli dot grid — decorative scattered dots */
export function RangoliDots({ color = "#FF9933", opacity = 0.15 }) {
  const dots = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 9; col++) {
      const isOffset = row % 2 === 1;
      dots.push({ x: col * 28 + (isOffset ? 14 : 0), y: row * 24, r: col % 3 === 0 ? 3 : 1.5 });
    }
  }
  return (
    <svg width="260" height="120" viewBox="0 0 260 120" style={{ opacity, userSelect: "none" }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} />
      ))}
    </svg>
  );
}

/** Indian arch / temple top decorative divider */
export function ArchDivider({ color = "rgba(255,153,51,0.15)" }) {
  return (
    <div
      style={{
        width: "100%",
        height: "40px",
        background: `repeating-linear-gradient(
          90deg,
          transparent,
          transparent 60px,
          ${color} 60px,
          ${color} 61px
        )`,
        maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
}
