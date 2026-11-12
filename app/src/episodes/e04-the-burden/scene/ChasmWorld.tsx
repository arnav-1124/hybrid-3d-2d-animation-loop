import React, { useMemo } from "react";
import * as THREE from "three";
import {
  BG,
  BRIDGE_STONE,
  DAWN_LIGHT,
  MOTE_COLOR,
  PILLAR_COLOR,
  PILLAR_EDGE,
  VOID_GLOW,
} from "../palette";
import { BEATS, type SlabState } from "../timeline";

interface ChasmWorldProps {
  frame: number;
  slab: SlabState;
}

// Procedural floating ember/dust particles
const MOTE_COUNT = 85;

export const ChasmWorld: React.FC<ChasmWorldProps> = ({ frame, slab }) => {
  // Deterministic floating motes
  const motes = useMemo(() => {
    const arr: [number, number, number, number][] = [];
    for (let i = 0; i < MOTE_COUNT; i++) {
      const x = -6 + (i * 1.37) % 18;
      const baseY = -2 + (i * 0.93) % 7;
      const z = -2.5 + (i * 0.67) % 5;
      const speed = 0.015 + ((i * 0.007) % 0.02);
      arr.push([x, baseY, z, speed]);
    }
    return arr;
  }, []);

  const isCrossed = frame >= BEATS.crossStart;

  return (
    <group>
      {/* 1. ATMOSPHERIC LIGHTING */}
      <ambientLight color="#161929" intensity={0.9} />
      {/* Crisp overhead directional key light */}
      <directionalLight position={[-4, 8, 6]} color="#f1f5f9" intensity={1.5} />
      {/* Crimson rim light from the deep chasm void below */}
      <directionalLight position={[2, -6, 2]} color={VOID_GLOW} intensity={2.6} />
      {/* Warm Dawn spotlight at destination platform */}
      <pointLight position={[9, 4, 1]} color={DAWN_LIGHT} intensity={isCrossed ? 5.0 : 2.5} distance={14} />

      {/* 2. FLOATING STONE PILLARS (The Chasm Pathway) */}
      {/* Platform 0: Starting platform */}
      <StonePillar pos={[-4.5, -1.8, 0]} size={[4.2, 3.6, 3.6]} />

      {/* Platform 1: Stepping stone */}
      <StonePillar pos={[-0.8, -2.0, 0]} size={[2.4, 4.0, 3.2]} />

      {/* Platform 2: Mid stone */}
      <StonePillar pos={[1.6, -1.9, 0]} size={[2.0, 3.8, 3.2]} />

      {/* Platform 3: Edge Platform (Where the chasm breaks off at x = 3.8) */}
      <StonePillar pos={[3.4, -2.1, 0]} size={[2.0, 4.2, 3.4]} />

      {/* THE VOID GAP IS FROM x = 4.4 TO x = 6.6 (Empty air over the deep abyss) */}

      {/* Platform 4: Destination Dawn Platform (x = 8.2) */}
      <StonePillar pos={[8.6, -1.7, 0]} size={[4.5, 3.4, 4.0]} glow />

      {/* 3. THE ABANDONED SMALL BLOCK (Dropped by Traveler 1 at frame 25) */}
      {frame >= 25 && (
        <mesh position={[-3.6, 0.25, 0.4]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.2} />
        </mesh>
      )}

      {/* 4. THE HEAVY STONE SLAB (Carried -> Slams -> Becomes Bridge) */}
      <group position={slab.pos} rotation={slab.rot}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.26, 1.4]} />
          <meshStandardMaterial
            color={BRIDGE_STONE}
            roughness={0.65}
            metalness={0.25}
          />
        </mesh>
        {/* Edge highlight lines on the slab */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.4, 0.26, 1.4)]} />
          <lineBasicMaterial color={PILLAR_EDGE} />
        </lineSegments>
      </group>

      {/* 5. GLOWING VOID ABYSS (Ground glow in deep fog) */}
      <mesh position={[2, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35, 20]} />
        <meshBasicMaterial color={VOID_GLOW} transparent opacity={0.28} />
      </mesh>

      {/* 6. FLOATING DUST & EMBER PARTICLES */}
      {motes.map(([mx, baseY, mz, spd], i) => {
        const my = baseY + ((frame * spd) % 6);
        return (
          <mesh key={i} position={[mx, my, mz]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color={MOTE_COLOR} transparent opacity={0.65} />
          </mesh>
        );
      })}
    </group>
  );
};

// Sub-component for individual stone pillars
const StonePillar: React.FC<{
  pos: [number, number, number];
  size: [number, number, number];
  glow?: boolean;
}> = ({ pos, size, glow = false }) => {
  return (
    <group position={pos}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={glow ? "#252b3d" : PILLAR_COLOR}
          roughness={0.75}
          metalness={0.15}
        />
      </mesh>
      {/* Stone edge bevel outlines for graphic 3D readability */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size[0], size[1], size[2])]} />
        <lineBasicMaterial color={glow ? DAWN_LIGHT : PILLAR_EDGE} transparent opacity={glow ? 0.7 : 0.4} />
      </lineSegments>
    </group>
  );
};
