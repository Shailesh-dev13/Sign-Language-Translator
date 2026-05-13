// src/components/dashboard/ConnectionBadge.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { WS_STATE } from '../../hooks/useSignaWebSocket';

const CONFIG = {
  [WS_STATE.DISCONNECTED]: {
    icon: WifiOff,
    label: 'OFFLINE',
    color: 'var(--outline)',
    bg: 'rgba(148,142,156,0.1)',
    border: 'rgba(148,142,156,0.2)',
  },
  [WS_STATE.CONNECTING]: {
    icon: Loader,
    label: 'CONNECTING',
    color: '#e7c365',
    bg: 'rgba(231,195,101,0.08)',
    border: 'rgba(231,195,101,0.2)',
    spin: true,
  },
  [WS_STATE.CONNECTED]: {
    icon: Wifi,
    label: 'CONNECTED',
    color: '#e7c365',
    bg: 'rgba(231,195,101,0.08)',
    border: 'rgba(231,195,101,0.2)',
  },
  [WS_STATE.READY]: {
    icon: CheckCircle,
    label: 'BACKEND READY',
    color: '#00D2FF',
    bg: 'rgba(0,210,255,0.08)',
    border: 'rgba(0,210,255,0.2)',
  },
  [WS_STATE.ERROR]: {
    icon: AlertCircle,
    label: 'ERROR',
    color: '#ffb4ab',
    bg: 'rgba(255,180,171,0.08)',
    border: 'rgba(255,180,171,0.2)',
  },
};

export default function ConnectionBadge({ state, className = '' }) {
  const cfg = CONFIG[state] ?? CONFIG[WS_STATE.DISCONNECTED];
  const Icon = cfg.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={state}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono-label text-xs ${className}`}
        style={{
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        role="status"
        aria-label={`Backend connection: ${cfg.label}`}
      >
        <Icon
          size={11}
          style={cfg.spin ? { animation: 'spin 1s linear infinite' } : {}}
          aria-hidden="true"
        />
        {cfg.label}
      </motion.span>
    </AnimatePresence>
  );
}
