/**
 * components/ui/ParticleBackground.jsx
 * Canvas-based floating particle system with neural-network style connections.
 * Fixed behind all content with mouse parallax.
 */

import { useEffect, useRef, useCallback } from 'react';

const PARTICLE_COUNT  = 55;
const CONNECTION_DIST = 140;
const MOUSE_RADIUS    = 180;
const BASE_SPEED      = 0.28;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(w, h) {
  return {
    x:   Math.random() * w,
    y:   Math.random() * h,
    vx:  randomBetween(-BASE_SPEED, BASE_SPEED),
    vy:  randomBetween(-BASE_SPEED, BASE_SPEED),
    r:   randomBetween(1, 2.5),
    // Alternates between cyan and purple
    cyan: Math.random() > 0.45,
    opacity: randomBetween(0.3, 0.85),
  };
}

export default function ParticleBackground() {
  const canvasRef  = useRef(null);
  const particles  = useRef([]);
  const mouse      = useRef({ x: -9999, y: -9999 });
  const rafId      = useRef(null);

  const init = useCallback((canvas) => {
    const w = canvas.width  = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    init(canvas);

    // ── Mouse tracking ────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => init(canvas);
    window.addEventListener('resize', onResize);

    // ── Draw loop ─────────────────────────────────────────────────────────
    const CYAN   = '0, 229, 255';
    const PURPLE = '180, 77, 255';

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const pts = particles.current;

      // Update positions
      for (const p of pts) {
        // Subtle mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - d) / MOUSE_RADIUS * 0.5;
          p.vx += (dx / d) * force * 0.12;
          p.vy += (dy / d) * force * 0.12;
        }

        // Speed clamp
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > BASE_SPEED * 2.5) {
          p.vx = (p.vx / speed) * BASE_SPEED * 2.5;
          p.vy = (p.vy / speed) * BASE_SPEED * 2.5;
        }

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
            const col = pts[i].cyan ? CYAN : PURPLE;
            ctx.strokeStyle = `rgba(${col}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of pts) {
        const col = p.cyan ? CYAN : PURPLE;
        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0,   `rgba(${col}, ${p.opacity})`);
        grad.addColorStop(0.5, `rgba(${col}, ${p.opacity * 0.3})`);
        grad.addColorStop(1,   `rgba(${col}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(${col}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    rafId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [init]);

  return (
    <canvas
      id="particle-canvas"
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
