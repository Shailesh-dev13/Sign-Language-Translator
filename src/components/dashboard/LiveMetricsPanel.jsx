/**
 * components/dashboard/LiveMetricsPanel.jsx
 * Phase 4 — Real-time metrics dashboard above the translator grid.
 */

import { motion } from 'framer-motion';
import { Activity, Cpu, Target, Clock, Hash, Wifi } from 'lucide-react';
import { staggerContainer, fadeUp } from '../../animations/variants';

function MetricCard({ icon: Icon, label, value, unit = '', color, sublabel, pulse = false }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${color}22`,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* BG glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${color}08, transparent)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: `${color}15`, border: `1px solid ${color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={13} style={{ color }} />
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
        {pulse && (
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: color, boxShadow: `0 0 8px ${color}`,
            animation: 'pulse-dot 1.5s ease-in-out infinite',
          }} />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontFamily: 'Orbitron, JetBrains Mono, monospace',
          fontSize: 22, fontWeight: 700, color,
          lineHeight: 1,
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--outline)' }}>
            {unit}
          </span>
        )}
      </div>

      {sublabel && (
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', letterSpacing: '0.04em' }}>
          {sublabel}
        </span>
      )}
    </motion.div>
  );
}

/**
 * @param {object} props
 * @param {boolean}  props.modelActive
 * @param {number}   props.fps
 * @param {number}   props.confidence          0–1
 * @param {string}   props.currentSign
 * @param {string}   props.sessionTime         formatted mm:ss
 * @param {number}   props.predictionCount
 */
export default function LiveMetricsPanel({
  modelActive   = false,
  fps           = 0,
  confidence    = 0,
  currentSign   = '—',
  sessionTime   = '00:00',
  predictionCount = 0,
}) {
  const confPct  = Math.round(confidence * 100);
  const confColor = confidence >= 0.75 ? '#39ff85' : confidence >= 0.5 ? '#f0d070' : '#ff6b6b';

  const metrics = [
    {
      icon: Wifi,
      label: 'Model Status',
      value: modelActive ? 'ACTIVE' : 'STANDBY',
      color: modelActive ? '#39ff85' : 'var(--outline)',
      sublabel: modelActive ? 'ASLNet v2.4 running' : 'Waiting for stream',
      pulse: modelActive,
    },
    {
      icon: Activity,
      label: 'FPS',
      value: fps,
      unit: 'fps',
      color: fps >= 25 ? '#00e5ff' : fps >= 15 ? '#f0d070' : '#ff6b6b',
      sublabel: 'WebSocket frame rate',
    },
    {
      icon: Target,
      label: 'Confidence',
      value: `${confPct}%`,
      color: confColor,
      sublabel: confidence >= 0.75 ? 'High accuracy' : confidence >= 0.5 ? 'Moderate' : 'Low signal',
    },
    {
      icon: Cpu,
      label: 'Current Sign',
      value: currentSign || '—',
      color: '#b44dff',
      sublabel: 'Latest detection',
    },
    {
      icon: Clock,
      label: 'Session Time',
      value: sessionTime,
      color: '#00e5ff',
      sublabel: 'Active translation time',
    },
    {
      icon: Hash,
      label: 'Predictions',
      value: predictionCount,
      color: '#f472b6',
      sublabel: 'Signs detected this session',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 10,
        marginBottom: 20,
      }}
      aria-label="Live AI metrics"
    >
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </motion.div>
  );
}
