// src/components/TranslatorView.jsx
/**
 * TranslatorView
 * ==============
 * Webcam component streaming frames to the FastAPI backend via WebSocket.
 * Displays real-time ASL predictions from the PyTorch CNN model.
 *
 * Inference stack:
 *   Webcam → useSignaWebSocket → FastAPI → MediaPipe HandLandmarker + ASLNet → prediction
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Hand, Zap } from 'lucide-react';
import useSignaWebSocket, { WS_STATE } from '../hooks/useSignaWebSocket';
import ConnectionBadge from './dashboard/ConnectionBadge';

const VIDEO_CONSTRAINTS = { width: 1280, height: 720, facingMode: 'user' };

// ── Sub-components ────────────────────────────────────────────────────────────

function Top5Panel({ top5 }) {
  if (!top5?.length) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <p className="font-mono-label" style={{ color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11, marginBottom: 8 }}>
        Alternatives
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {top5.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="font-mono-code"
              style={{
                fontSize: 12, width: 52, fontWeight: i === 0 ? 700 : 400,
                color: i === 0 ? 'var(--neon-cyan)' : 'var(--on-surface-variant)',
              }}
            >
              {item.label}
            </span>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--surface-high)', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 2, background: i === 0 ? 'linear-gradient(to right,#00D2FF,#9D4EDD)' : 'rgba(255,255,255,0.15)' }}
                animate={{ width: `${Math.round(item.confidence * 100)}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <span className="font-mono-code" style={{ fontSize: 11, color: 'var(--on-surface-variant)', width: 36, textAlign: 'right' }}>
              {Math.round(item.confidence * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LatencyBadge({ ms }) {
  if (ms == null) return null;
  const color = ms < 80 ? '#00D2FF' : ms < 200 ? '#e7c365' : '#ffb4ab';
  return (
    <span className="font-mono-label" style={{ fontSize: 10, color, background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
      <Zap size={9} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
      {Math.round(ms)}ms
    </span>
  );
}

function LandmarkCount({ count }) {
  if (!count) return null;
  return (
    <span className="font-mono-label" style={{
      fontSize: 10, color: '#9D4EDD',
      background: 'rgba(157,78,221,0.08)', padding: '2px 6px',
      borderRadius: 4, border: '1px solid rgba(157,78,221,0.2)',
    }}>
      {count} landmarks
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TranslatorView({ onNewLetter, onStreamingChange }) {
  const webcamRef   = useRef(null);
  const [cameraError, setCameraError] = useState('');
  const [isReady,     setIsReady]     = useState(false);
  const [isOn,        setIsOn]        = useState(true);
  const [facingMode,  setFacingMode]  = useState('user');

  const handleNewLetter = useCallback((label, conf) => {
    if (onNewLetter) onNewLetter(label, conf);
  }, [onNewLetter]);

  const {
    connectionState,
    statusMsg,
    prediction,
    handDetected,
    top5,
    latencyMs,
    serverInfo,
    landmarks,
  } = useSignaWebSocket({
    videoRef:     webcamRef,
    onNewLetter:  handleNewLetter,
    enabled:      isReady && isOn,
  });

  const isWsReady  = connectionState === WS_STATE.READY;
  const isStreaming = isWsReady && isReady && isOn;

  // Notify parent of streaming state changes
  useEffect(() => {
    onStreamingChange?.(isStreaming);
  }, [isStreaming, onStreamingChange]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <motion.div
        className="glass-card"
        style={{ overflow: 'hidden', position: 'relative', borderRadius: 20 }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Camera size={15} color="var(--neon-cyan)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>Video Capture</span>
            {serverInfo && (
              <span className="font-mono-label" style={{ color: 'var(--outline)', fontSize: 10 }}>
                · {serverInfo.classes} classes
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ConnectionBadge state={connectionState} />

            {/* Hand detected indicator */}
            {isStreaming && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 20, fontSize: 10,
                background: handDetected ? 'rgba(0,210,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${handDetected ? 'rgba(0,210,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
                color: handDetected ? 'var(--neon-cyan)' : 'var(--outline)',
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                <Hand size={10} />
                {handDetected ? 'HAND' : 'NO HAND'}
              </span>
            )}

            {/* Landmark count badge */}
            {isStreaming && <LandmarkCount count={landmarks?.length} />}

            {/* Camera toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="font-mono-label" style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>
                {isOn ? 'ON' : 'OFF'}
              </span>
              <button
                onClick={() => setIsOn(p => !p)}
                aria-label={isOn ? 'Turn camera off' : 'Turn camera on'}
                aria-pressed={isOn}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none',
                  background: isOn ? 'linear-gradient(135deg,#00D2FF,#9D4EDD)' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer', position: 'relative', transition: 'background 0.3s', padding: 0,
                }}
              >
                <motion.div
                  style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3 }}
                  animate={{ left: isOn ? 23 : 3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Video area ── */}
        <div style={{ position: 'relative' }}>

          {/* Camera not ready / error overlay */}
          {(!isReady || cameraError) && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10, aspectRatio: '16/9',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(20,18,24,0.9)', backdropFilter: 'blur(8px)', gap: 12, padding: 24,
            }}>
              {cameraError ? (
                <p style={{ color: '#ffb4ab', fontSize: 13, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
                  {cameraError}
                </p>
              ) : (
                <>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: '2px solid rgba(0,210,255,0.15)', borderTopColor: '#00D2FF',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                    Initialising camera…
                  </p>
                </>
              )}
            </div>
          )}

          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={facingMode === 'user'}
            videoConstraints={{ ...VIDEO_CONSTRAINTS, facingMode }}
            onUserMedia={() => { setCameraError(''); setIsReady(true); }}
            onUserMediaError={(e) => { setIsReady(false); setCameraError(e?.message || e?.name || 'Camera permission denied.'); }}
            style={{ width: '100%', aspectRatio: '16/9', display: 'block', objectFit: 'cover' }}
          />

          {/* Backend not ready notice */}
          {isReady && isOn && !isWsReady && (
            <div style={{
              position: 'absolute', left: 16, right: 16, bottom: 16, zIndex: 20,
              padding: '10px 14px', borderRadius: 12, textAlign: 'center',
              background: 'rgba(17,24,39,0.88)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(231,195,101,0.25)',
              color: '#e7c365', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
            }}>
              {statusMsg || 'Connecting to Signa AI backend at ws://localhost:8000…'}
            </div>
          )}

          {/* Live prediction overlay */}
          {isStreaming && (
            <>
              {/* Top-right: LIVE badge + latency */}
              <div style={{
                position: 'absolute', top: 12, right: 12, zIndex: 20,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <LatencyBadge ms={latencyMs} />
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(0,210,255,0.2)', borderRadius: 20, padding: '4px 10px',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                    background: '#00D2FF', boxShadow: '0 0 8px #00D2FF',
                    animation: 'pulse-dot 1.5s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    PyTorch
                  </span>
                </div>
              </div>

              {/* Bottom: detected sign + confidence bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
                background: 'linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.4), transparent)',
                padding: '40px 22px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                  {/* Sign label */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Detected Sign
                    </span>
                    <AnimatePresence mode="wait">
                      {prediction?.label && prediction.label !== 'nothing' ? (
                        <motion.div
                          key={prediction.label}
                          initial={{ opacity: 0, y: 14, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.9 }}
                          transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
                          style={{
                            fontSize: 56, fontWeight: 700, lineHeight: 1, color: 'white',
                            textShadow: `0 0 32px ${prediction.smoothed ? 'rgba(0,210,255,0.6)' : 'rgba(255,255,255,0.3)'}`,
                          }}
                          aria-live="polite"
                          aria-label={`Detected: ${prediction.label}`}
                        >
                          {prediction.label}
                          {prediction.smoothed && (
                            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#00D2FF', marginLeft: 8, verticalAlign: 'super' }}>✓</span>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          style={{ fontSize: 40, color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                          —
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confidence meter */}
                  {prediction?.confidence != null && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, minWidth: 100 }}>
                      <span className="font-mono-label" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>Confidence</span>
                      <span style={{
                        fontSize: 22, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                        color: prediction.confidence >= 0.75 ? '#00D2FF' : prediction.confidence >= 0.55 ? '#e7c365' : '#ffb4ab',
                      }}>
                        {Math.round(prediction.confidence * 100)}%
                      </span>
                      <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <motion.div
                          style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(to right,#00D2FF,#9D4EDD)' }}
                          animate={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer: top-5 + switch camera ── */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Top5Panel top5={top5} />

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: top5.length ? 10 : 0 }}>
            <button
              onClick={() => setFacingMode(m => m === 'user' ? 'environment' : 'user')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--on-surface-variant)', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              aria-label="Switch camera"
            >
              <RefreshCw size={13} />
              Switch Camera
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
