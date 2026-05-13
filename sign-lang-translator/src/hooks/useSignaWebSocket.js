// src/hooks/useSignaWebSocket.js
/**
 * useSignaWebSocket
 * =================
 * Manages the WebSocket connection to the Signa AI FastAPI backend.
 *
 * Protocol:
 *   CLIENT → SERVER: { type: "frame", data: "<base64 JPEG>" }
 *   CLIENT → SERVER: { type: "ping" }
 *   CLIENT → SERVER: { type: "history" }
 *
 *   SERVER → CLIENT: { type: "ready",      message, classes }
 *   SERVER → CLIENT: { type: "prediction", prediction, label, confidence,
 *                       top5, landmarks, smoothed, emitted, hand_detected,
 *                       latency_ms }
 *   SERVER → CLIENT: { type: "no_hand",    hand_detected: false, landmarks: [] }
 *   SERVER → CLIENT: { type: "history",    items: [...] }
 *   SERVER → CLIENT: { type: "error",      message }
 *   SERVER → CLIENT: { type: "pong" }
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws';
const FRAME_INTERVAL_MS   = 150;    // ~6.7 fps to backend
const JPEG_QUALITY        = 0.65;
const PING_INTERVAL_MS    = 20000;  // keep-alive
const BASE_RECONNECT_MS   = 800;
const MAX_RECONNECT_MS    = 10000;

// Set to true to enable verbose console logging for debugging
// Or toggle at runtime: window.__SIGNA_DEBUG = true
const DEBUG = false;

function wsLog(...args) {
  if (DEBUG || window.__SIGNA_DEBUG) console.log('[WS]', ...args);
}
function wsWarn(...args) {
  if (DEBUG || window.__SIGNA_DEBUG) console.warn('[WS]', ...args);
}

export const WS_STATE = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING:   'CONNECTING',
  CONNECTED:    'CONNECTED',
  READY:        'READY',
  ERROR:        'ERROR',
};

export default function useSignaWebSocket({ videoRef, onNewLetter, enabled = true }) {
  const wsRef            = useRef(null);
  const frameTimerRef    = useRef(null);
  const pingTimerRef     = useRef(null);
  const reconnectRef     = useRef(null);
  const attemptsRef      = useRef(0);
  const mountedRef       = useRef(true);
  const canvasRef        = useRef(document.createElement('canvas'));
  // Store latest onNewLetter in a ref to avoid stale closures
  const onNewLetterRef   = useRef(onNewLetter);
  // Track frame send count for debug logging
  const frameSentCount   = useRef(0);

  useEffect(() => {
    onNewLetterRef.current = onNewLetter;
  }, [onNewLetter]);

  const [connectionState, setConnectionState] = useState(WS_STATE.DISCONNECTED);
  const [statusMsg,       setStatusMsg]       = useState('');
  const [prediction,      setPrediction]      = useState(null);
  const [handDetected,    setHandDetected]    = useState(false);
  const [top5,            setTop5]            = useState([]);
  const [latencyMs,       setLatencyMs]       = useState(null);
  const [serverInfo,      setServerInfo]      = useState(null);
  const [history,         setHistory]         = useState([]);
  const [landmarks,       setLandmarks]       = useState([]);

  // ── Frame capture ───────────────────────────────────────────────────────
  const captureFrame = useCallback(() => {
    const video = videoRef?.current?.video ?? videoRef?.current;
    if (!video || video.readyState < 2) return null;
    const W = video.videoWidth  || 640;
    const H = video.videoHeight || 480;
    const canvas = canvasRef.current;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    // Mirror to match what the user sees
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -W, 0, W, H);
    ctx.restore();
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  }, [videoRef]);

  // ── Send helpers ────────────────────────────────────────────────────────
  const sendFrame = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const data = captureFrame();
    if (data) {
      ws.send(JSON.stringify({ type: 'frame', data }));
      frameSentCount.current += 1;
      // Log every 20th frame to avoid console spam
      if (frameSentCount.current % 20 === 1) {
        wsLog(`Frame #${frameSentCount.current} sent (${Math.round(data.length / 1024)}KB)`);
      }
    }
  }, [captureFrame]);

  const sendPing = useCallback(() => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'ping' }));
    }
  }, []);

  const requestHistory = useCallback(() => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'history' }));
    }
  }, []);

  // ── Start / stop streaming ──────────────────────────────────────────────
  const startStreaming = useCallback(() => {
    if (frameTimerRef.current) return;
    wsLog('Starting frame streaming at', Math.round(1000 / FRAME_INTERVAL_MS), 'fps');
    frameSentCount.current = 0;
    frameTimerRef.current = setInterval(sendFrame, FRAME_INTERVAL_MS);
    pingTimerRef.current  = setInterval(sendPing,  PING_INTERVAL_MS);
  }, [sendFrame, sendPing]);

  const stopStreaming = useCallback(() => {
    if (frameTimerRef.current) {
      wsLog('Stopping frame streaming after', frameSentCount.current, 'frames');
    }
    clearInterval(frameTimerRef.current); frameTimerRef.current = null;
    clearInterval(pingTimerRef.current);  pingTimerRef.current  = null;
  }, []);

  // ── Message handler ─────────────────────────────────────────────────────
  const handleMessage = useCallback((event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }

    switch (msg.type) {
      case 'ready':
        wsLog('✅ Backend ready —', msg.classes, 'classes');
        setConnectionState(WS_STATE.READY);
        setStatusMsg(msg.message ?? 'Backend ready');
        setServerInfo({ classes: msg.classes });
        break;

      case 'prediction': {
        // Prefer 'prediction' field (new schema), fall back to 'label'
        const label = msg.prediction || msg.label;
        const conf  = msg.confidence ?? 0;

        setHandDetected(msg.hand_detected ?? true);
        setLatencyMs(msg.latency_ms ?? null);
        setTop5(msg.top5 ?? []);
        setLandmarks(msg.landmarks ?? []);
        setPrediction({
          label,
          confidence: conf,
          smoothed: msg.smoothed ?? false,
        });

        wsLog(
          `Prediction: "${label}" (${Math.round(conf * 100)}%)`,
          msg.smoothed ? '✓smoothed' : '',
          msg.emitted ? '📤emitted' : '',
          `${msg.latency_ms ?? '?'}ms`
        );

        // Notify parent only when backend confirms this should be emitted
        if (msg.emitted && label !== 'nothing') {
          const callback = onNewLetterRef.current;
          if (callback) {
            wsLog('📝 Emitting letter to panel:', label);
            callback(label, conf);
          }
        }
        break;
      }

      case 'no_hand':
        setHandDetected(false);
        setLatencyMs(msg.latency_ms ?? null);
        setLandmarks(msg.landmarks ?? []);
        setPrediction(null);
        setTop5([]);
        break;

      case 'history':
        wsLog('History received:', msg.items?.length, 'items');
        setHistory(msg.items ?? []);
        break;

      case 'pong':
      case 'idle':
        break;

      case 'error':
        wsWarn('Server error:', msg.message);
        setStatusMsg(msg.message ?? 'Unknown server error');
        break;

      default:
        wsWarn('Unknown message type:', msg.type);
        break;
    }
  }, []); // No deps — uses onNewLetterRef to avoid stale closures

  // ── Connect / disconnect ────────────────────────────────────────────────
  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionState(WS_STATE.CONNECTING);
    setStatusMsg('Connecting to Signa AI backend…');
    wsLog('Connecting to', WS_URL);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      attemptsRef.current = 0;
      wsLog('🔗 WebSocket connected');
      setConnectionState(WS_STATE.CONNECTED);
      setStatusMsg('Connected — waiting for model confirmation…');
    };

    ws.onmessage = handleMessage;

    ws.onerror = (e) => {
      if (!mountedRef.current) return;
      wsWarn('WebSocket error:', e);
      setConnectionState(WS_STATE.ERROR);
      setStatusMsg('Connection error — retrying…');
    };

    ws.onclose = (e) => {
      if (!mountedRef.current) return;
      wsLog('WebSocket closed (code:', e.code, 'reason:', e.reason || 'none', ')');
      stopStreaming();
      setConnectionState(WS_STATE.DISCONNECTED);

      const delay = Math.min(BASE_RECONNECT_MS * 2 ** attemptsRef.current, MAX_RECONNECT_MS);
      attemptsRef.current += 1;
      setStatusMsg(`Disconnected — reconnecting in ${(delay / 1000).toFixed(1)}s…`);
      wsLog('Reconnecting in', delay, 'ms (attempt', attemptsRef.current, ')');
      reconnectRef.current = setTimeout(connect, delay);
    };
  }, [handleMessage, stopStreaming]);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectRef.current);
    reconnectRef.current = null;
    stopStreaming();
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnectionState(WS_STATE.DISCONNECTED);
    wsLog('Disconnected (manual)');
  }, [stopStreaming]);

  // ── Auto-connect ────────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    if (enabled) connect();
    return () => { mountedRef.current = false; disconnect(); };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-start streaming when READY ────────────────────────────────────
  useEffect(() => {
    if (connectionState === WS_STATE.READY && enabled) {
      startStreaming();
    } else {
      stopStreaming();
    }
  }, [connectionState, enabled, startStreaming, stopStreaming]);

  return {
    connectionState,
    statusMsg,
    prediction,
    handDetected,
    top5,
    latencyMs,
    serverInfo,
    history,
    landmarks,
    isReady: connectionState === WS_STATE.READY,
    startStreaming,
    stopStreaming,
    disconnect,
    reconnect: connect,
    requestHistory,
  };
}
