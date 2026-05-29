/**
 * components/dashboard/AIPipeline.jsx
 * Phase 4 — Visual AI processing pipeline with animated signal flow.
 * Camera → Hand Detection → Feature Extraction → ASLNet → Prediction
 */

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Hand, Layers, Cpu, Zap } from 'lucide-react';

const STAGES = [
  { id: 'camera',   label: 'Camera',           sublabel: 'Webcam stream',         icon: Camera, color: '#00e5ff' },
  { id: 'detect',   label: 'Hand Detection',   sublabel: 'MediaPipe landmarks',   icon: Hand,   color: '#00c8e8' },
  { id: 'extract',  label: 'Feature Extract',  sublabel: '21 keypoints → vector', icon: Layers, color: '#7a66ff' },
  { id: 'aslnet',   label: 'ASLNet',           sublabel: 'CNN inference',         icon: Cpu,    color: '#b44dff' },
  { id: 'predict',  label: 'Prediction',       sublabel: 'Top-5 classification',  icon: Zap,    color: '#f472b6' },
];

function PipelineNode({ stage, active, isLast }) {
  const { icon: Icon, label, sublabel, color } = stage;
  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1, minWidth: 0 }}>
      {/* Node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <motion.div
          animate={active ? {
            boxShadow: [`0 0 0px ${color}40`, `0 0 20px ${color}70`, `0 0 0px ${color}40`],
          } : { boxShadow: '0 0 0px transparent' }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: active ? `${color}18` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.07)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.4s ease',
          }}
        >
          <Icon size={18} style={{ color: active ? color : 'var(--outline)', transition: 'color 0.4s' }} />
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, color: active ? color : 'var(--outline)', letterSpacing: '0.04em', whiteSpace: 'nowrap', transition: 'color 0.4s' }}>
            {label}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', marginTop: 1 }}>
            {sublabel}
          </div>
        </div>
      </div>

      {/* Connector to next node */}
      {!isLast && (
        <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, position: 'relative', overflow: 'hidden', margin: '0 4px', marginBottom: 28, minWidth: 20 }}>
          {active && (
            <motion.div
              style={{
                position: 'absolute',
                width: '20%', height: '100%', borderRadius: 1,
                background: `linear-gradient(to right, transparent, ${stage.color}, transparent)`,
                boxShadow: `0 0 8px ${stage.color}`,
              }}
              animate={{ left: ['-20%', '120%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: STAGES.indexOf(stage) * 0.28 }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @param {boolean} active — whether the pipeline is running (WS connected + camera on)
 */
export default function AIPipeline({ active = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: '16px 20px',
        marginTop: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="AI processing pipeline"
    >
      {/* Background glow when active */}
      {active && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,229,255,0.03), transparent)',
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--outline)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          AI Processing Pipeline
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {active ? (
            <>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#39ff85', boxShadow: '0 0 8px #39ff85', animation: 'pulse-dot 1.5s ease-in-out infinite', display: 'inline-block' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#39ff85' }}>RUNNING</span>
            </>
          ) : (
            <>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--outline)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--outline)' }}>STANDBY</span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', overflowX: 'auto', paddingBottom: 4 }}>
        {STAGES.map((stage, i) => (
          <PipelineNode
            key={stage.id}
            stage={stage}
            active={active}
            isLast={i === STAGES.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
}
