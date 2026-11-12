import React from "react";
import { useCurrentFrame } from "remotion";
import { DustMotes } from "../../shared/three/DustMotes";
import { Strut } from "../../shared/three/Strut";
import {
  DUST,
  FLOOR,
  GRID_A,
  GRID_B,
  MONOLITH,
  STAND_AXLE,
  STAND_FOOT,
  STAND_LEG,
  STEEL_HUB,
  STEEL_RIM,
  STEEL_RUNG,
  STEEL_SIDE,
  STEEL_SPOKE_B,
  STEEL_SPOKE_F,
} from "./palette";
import { FPS } from "./timeline";

const R = 3.2; // wheel radius
const HUB_Y = 3.62; // axle height
const RING_Z = 0.78; // half-width of the wheel (side rings)
const RUNGS = 20;

// Life element: distant monoliths in the fog (the void has *something* out there).
const MONOLITHS: Array<[number, number, number, number]> = [
  // x, z, width, height (kept near the camera's narrow FOV band, behind the wheel)
  [-9, -14, 2.2, 11],
  [7.5, -18, 2.8, 14],
  [11, -8, 2.0, 9],
  [-11, -4, 2.6, 16],
  [8, -26, 3.0, 18],
  [-7, -24, 2.4, 13],
];

const Monoliths: React.FC = () => (
  <>
    {MONOLITHS.map(([x, z, w, h], i) => (
      <mesh key={i} position={[x, h / 2, z]}>
        <boxGeometry args={[w, h, 0.9]} />
        <meshStandardMaterial color={MONOLITH} roughness={0.92} metalness={0.05} />
      </mesh>
    ))}
  </>
);

export const WheelScene: React.FC<{ angle: number; speed: number }> = ({ angle, speed }) => {
  const frame = useCurrentFrame();
  const rungs = Array.from({ length: RUNGS }, (_, i) => (i / RUNGS) * Math.PI * 2);
  const spokes = Array.from({ length: 9 }, (_, i) => (i / 9) * Math.PI * 2);

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#3a3a4a", "#000000", 0.5]} />
      <directionalLight position={[5, 12, 7]} intensity={1.9} />
      <pointLight position={[-8, 3, -6]} intensity={60} color="#5a6cff" />
      <pointLight position={[14, 3, 6]} intensity={70} color="#ffb347" />
      <spotLight position={[0, 15, 4]} angle={0.6} penumbra={1} intensity={500} color="#dfe6ff" />

      {/* Floor + grid: deliberately static, part of the "going nowhere" reveal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={FLOOR} roughness={0.95} metalness={0} />
      </mesh>
      <gridHelper args={[80, 52, GRID_A, GRID_B]} position={[0, 0.01, 0]} />

      {/* Wheel — spins around Z (top surface moves -X, matching a +X runner).
          Slight X-tilt wobble scaled by speed: the machine feels alive/strained. */}
      <group
        position={[0, HUB_Y, 0]}
        rotation={[0.02 * speed * Math.sin(frame * 0.37), 0, -angle]}
      >
        <mesh>
          <torusGeometry args={[R, 0.07, 12, 96]} />
          <meshStandardMaterial color={STEEL_RIM} metalness={0.7} roughness={0.35} />
        </mesh>
        {[RING_Z, -RING_Z].map((z) => (
          <mesh key={z} position={[0, 0, z]}>
            <torusGeometry args={[R, 0.045, 10, 96]} />
            <meshStandardMaterial color={STEEL_SIDE} metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
        {rungs.map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * (R - 0.06), Math.sin(a) * (R - 0.06), 0]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[0.09, 0.09, RING_Z * 2 - 0.06]} />
            <meshStandardMaterial color={STEEL_RUNG} metalness={0.5} roughness={0.45} />
          </mesh>
        ))}
        {spokes.map((a, i) => (
          <React.Fragment key={i}>
            <mesh
              position={[Math.cos(a) * R * 0.5, Math.sin(a) * R * 0.5, RING_Z - 0.06]}
              rotation={[0, 0, a - Math.PI / 2]}
            >
              <cylinderGeometry args={[0.03, 0.03, R - 0.1, 8]} />
              <meshStandardMaterial color={STEEL_SPOKE_F} metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh
              position={[Math.cos(a) * R * 0.5, Math.sin(a) * R * 0.5, -RING_Z + 0.06]}
              rotation={[0, 0, a - Math.PI / 2]}
            >
              <cylinderGeometry args={[0.03, 0.03, R - 0.1, 8]} />
              <meshStandardMaterial color={STEEL_SPOKE_B} metalness={0.6} roughness={0.4} />
            </mesh>
          </React.Fragment>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.7, 16]} />
          <meshStandardMaterial color={STEEL_HUB} metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Axle + A-frame stand: static, sells "installed here, going nowhere" */}
      <mesh position={[0, HUB_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 3.0, 10]} />
        <meshStandardMaterial color={STAND_AXLE} metalness={0.8} roughness={0.3} />
      </mesh>
      {[1.35, -1.35].map((z) => (
        <React.Fragment key={z}>
          <Strut a={[0, HUB_Y, z]} b={[1.35, 0, z + 0.25]} r={0.055} color={STAND_LEG} metalness={0.6} />
          <Strut a={[0, HUB_Y, z]} b={[-1.35, 0, z + 0.25]} r={0.055} color={STAND_LEG} metalness={0.6} />
          <mesh position={[0, 0.05, z + 0.25]}>
            <boxGeometry args={[3.4, 0.1, 0.3]} />
            <meshStandardMaterial color={STAND_FOOT} roughness={0.8} />
          </mesh>
        </React.Fragment>
      ))}

      <Monoliths />
      <DustMotes speed={speed} color={DUST} />
    </>
  );
};
