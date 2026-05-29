/**
 * hooks/useSessionMetrics.js
 * Tracks live dashboard metrics: FPS, session time, prediction count.
 * All tracking is purely client-side with no backend interaction.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @param {object} opts
 * @param {boolean} opts.enabled  — whether the session is active (camera + WS connected)
 * @param {number}  opts.confidence — current confidence value from WebSocket
 * @returns {{ fps, sessionTime, predictionCount, sessionTimeFormatted, recordPrediction }}
 */
export default function useSessionMetrics({ enabled = false, confidence = 0 } = {}) {
  const [fps,             setFps]             = useState(0);
  const [sessionTime,     setSessionTime]     = useState(0);   // seconds
  const [predictionCount, setPredictionCount] = useState(0);

  // FPS tracking via requestAnimationFrame
  const frameCount  = useRef(0);
  const lastTime    = useRef(performance.now());
  const rafId       = useRef(null);

  // Session timer
  const timerRef    = useRef(null);

  // ── FPS counter ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) {
      setFps(0);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const tick = (now) => {
      frameCount.current += 1;
      const delta = now - lastTime.current;
      if (delta >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / delta));
        frameCount.current = 0;
        lastTime.current   = now;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  // ── Session timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    timerRef.current = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [enabled]);

  // ── Record a new prediction ───────────────────────────────────────────────
  const recordPrediction = useCallback(() => {
    setPredictionCount((c) => c + 1);
  }, []);

  // ── Format seconds → mm:ss ────────────────────────────────────────────────
  const sessionTimeFormatted = (() => {
    const m = Math.floor(sessionTime / 60).toString().padStart(2, '0');
    const s = (sessionTime % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  })();

  return {
    fps,
    sessionTime,
    sessionTimeFormatted,
    predictionCount,
    recordPrediction,
  };
}
