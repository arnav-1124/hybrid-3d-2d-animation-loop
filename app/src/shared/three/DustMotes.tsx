import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";

interface Mote {
  x: number;
  y: number;
  z: number;
  drift: number;
  phase: number;
}

// Deterministic pseudo-random mote placement from the index — same layout every render.
const mote = (i: number): Mote => ({
  x: ((i * 137) % 340) / 10 - 17,
  y: 0.3 + ((i * 89) % 95) / 10,
  z: ((i * 53) % 240) / 10 - 14,
  drift: 0.22 + ((i * 17) % 35) / 100,
  phase: (i % 11) * 0.57,
});

// Life element: dust motes drifting through the void. Brightens with scene speed.
export const DustMotes: React.FC<{
  speed: number;
  count?: number;
  color?: string;
  baseOpacity?: number;
  speedOpacity?: number;
}> = ({ speed, count = 42, color = "#c3c8de", baseOpacity = 0.28, speedOpacity = 0.3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pointsRef = useRef<THREE.Points>(null);
  const motes = useMemo(() => Array.from({ length: count }, (_, i) => mote(i)), [count]);
  const positions = useMemo(() => new Float32Array(motes.length * 3), [motes]);

  // useLayoutEffect: must land before @remotion/three's passive frame advance
  useLayoutEffect(() => {
    const t = frame / fps;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      positions[i * 3] = ((m.x + t * m.drift * 0.35 + 17) % 34) - 17;
      positions[i * 3 + 1] = m.y + Math.sin(t * 0.55 + m.phase * 1.7) * 0.45;
      positions[i * 3 + 2] = m.z + Math.cos(t * 0.62 + m.phase) * 0.35;
    }
    const geo = pointsRef.current?.geometry;
    if (geo) {
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      geo.computeBoundingSphere();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={color}
        transparent
        opacity={baseOpacity + speedOpacity * speed}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
