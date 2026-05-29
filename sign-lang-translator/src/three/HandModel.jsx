/**
 * three/HandModel.jsx
 * Phase 3 — Procedural 3D ASL hand rendered with React Three Fiber.
 * No external GLB needed — built from Three.js geometry.
 */

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Finger segment component ──────────────────────────────────────────────────
function FingerSegment({ position, length = 0.28, radius = 0.065, rotation = [0, 0, 0], color }) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder args={[radius * 0.85, radius, length, 8]} position={[0, length / 2, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.18}
          roughness={0.35}
          metalness={0.7}
        />
      </Cylinder>
      {/* Knuckle */}
      <Sphere args={[radius, 8, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.3}
          metalness={0.75}
        />
      </Sphere>
    </group>
  );
}

// ── Full finger (3 segments) ──────────────────────────────────────────────────
function Finger({ basePos, bend = 0, spread = 0, lengths = [0.3, 0.24, 0.2], color, isThumb = false }) {
  const seg1Len = lengths[0];
  const seg2Len = lengths[1];
  const seg3Len = lengths[2];

  // Thumb bends sideways
  const axis = isThumb ? [0, 0, 1] : [1, 0, 0];
  const bendRot = isThumb
    ? [0, 0, bend * 0.4 + 0.3]
    : [bend * -0.15, 0, spread];

  return (
    <group position={basePos} rotation={bendRot}>
      <FingerSegment position={[0, 0, 0]} length={seg1Len} color={color} />
      <group position={[0, seg1Len, 0]} rotation={[bend * 0.3, 0, 0]}>
        <FingerSegment position={[0, 0, 0]} length={seg2Len} color={color} />
        <group position={[0, seg2Len, 0]} rotation={[bend * 0.25, 0, 0]}>
          <FingerSegment position={[0, 0, 0]} length={seg3Len} color={color} />
        </group>
      </group>
    </group>
  );
}

// ── ASL hand shape (open palm with slight curve) ──────────────────────────────
function HandMesh() {
  const handRef = useRef();
  const glowRef = useRef();

  const PALM_COLOR  = '#0a1a2e';
  const FINGER_COL  = '#0d2240';
  const EMIT_COLOR  = new THREE.Color(0x00e5ff);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Subtle idle sway
    if (handRef.current) {
      handRef.current.rotation.z = Math.sin(t * 0.6) * 0.04;
      handRef.current.rotation.x = Math.sin(t * 0.4) * 0.03;
    }
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0.15 + Math.sin(t * 1.2) * 0.08;
    }
  });

  const fingerColor = '#1a3a60';

  return (
    <group ref={handRef} rotation={[0.2, 0, 0]} scale={1}>
      {/* ── Palm ── */}
      <mesh ref={glowRef} position={[0, -0.1, 0]}>
        <boxGeometry args={[0.72, 0.82, 0.22]} />
        <meshStandardMaterial
          color={PALM_COLOR}
          emissive={EMIT_COLOR}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Palm edge rounding helper */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.68, 0.78, 0.18]} />
        <meshStandardMaterial
          color='#0c2038'
          emissive={EMIT_COLOR}
          emissiveIntensity={0.08}
          roughness={0.2}
          metalness={0.9}
          transparent opacity={0.7}
        />
      </mesh>

      {/* ── Wrist / base ── */}
      <mesh position={[0, -0.56, 0]}>
        <cylinderGeometry args={[0.3, 0.28, 0.22, 12]} />
        <meshStandardMaterial color={PALM_COLOR} emissive={EMIT_COLOR} emissiveIntensity={0.1} roughness={0.35} metalness={0.75} />
      </mesh>

      {/* ── Fingers ── */}
      {/* Pinky */}
      <Finger basePos={[-0.29, 0.28, 0]} bend={0.1} spread={-0.12} lengths={[0.26, 0.2, 0.16]} color={fingerColor} />
      {/* Ring */}
      <Finger basePos={[-0.1,  0.33, 0]} bend={0.08} spread={-0.04} lengths={[0.29, 0.22, 0.18]} color={fingerColor} />
      {/* Middle */}
      <Finger basePos={[0.1,   0.34, 0]} bend={0.07} spread={0.04} lengths={[0.31, 0.24, 0.19]} color={fingerColor} />
      {/* Index */}
      <Finger basePos={[0.29,  0.3,  0]} bend={0.09} spread={0.12} lengths={[0.28, 0.22, 0.17]} color={fingerColor} />
      {/* Thumb */}
      <Finger basePos={[0.38, -0.06, 0]} bend={-0.3} spread={0} lengths={[0.24, 0.2, 0.16]} color={fingerColor} isThumb />

      {/* ── Neon edge glow lines (decorative) ── */}
      {[-0.36, 0.36].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0]}>
          <boxGeometry args={[0.02, 0.82, 0.02]} />
          <meshStandardMaterial
            color='#00e5ff' emissive={new THREE.Color(0x00e5ff)}
            emissiveIntensity={1.5} roughness={0} metalness={1}
            transparent opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Holographic ring ──────────────────────────────────────────────────────────
function HoloRing({ radius, speed = 1, color }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * speed;
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 80]} />
      <meshStandardMaterial
        color={color} emissive={new THREE.Color(color)}
        emissiveIntensity={1.2} roughness={0} metalness={1}
        transparent opacity={0.45}
      />
    </mesh>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
export default function HandModel({ className = '', style = {} }) {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 320, ...style }}
      aria-label="3D ASL hand model"
    >
      <Canvas
        camera={{ position: [0, 0.2, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[3, 4, 3]}   intensity={1.2} color="#00e5ff" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#b44dff" />
        <pointLight position={[0, -4, -2]} intensity={0.4} color="#ffffff" />
        <spotLight
          position={[0, 5, 2]}
          intensity={0.6}
          color="#00e5ff"
          angle={0.4}
          penumbra={0.8}
        />

        <Suspense fallback={null}>
          {/* Float wraps the hand in a gentle bob */}
          <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.5}>
            <HandMesh />
            {/* Holographic orbital rings */}
            <HoloRing radius={1.15} speed={0.4}  color="#00e5ff" />
            <HoloRing radius={1.35} speed={-0.25} color="#b44dff" />
          </Float>

          <Environment preset="night" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI * 0.72}
        />
      </Canvas>
    </div>
  );
}
