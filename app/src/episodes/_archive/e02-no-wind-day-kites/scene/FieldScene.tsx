// The field: floor, grid, fog-dressed monoliths, dust. Static — the world does
// not move; only the characters' choices do.
import React from "react";
import { DustMotes } from "../../../shared/three/DustMotes";
import { DUST, FLOOR, GRID_A, GRID_B, MONOLITH } from "../palette";

const MONOLITHS: Array<[number, number, number, number]> = [
  // x, z, width, height (inside the wide camera's view band, behind the lanes)
  [-14, -22, 2.2, 12],
  [12, -28, 2.8, 16],
  [-9, -34, 2.4, 14],
  [7, -18, 2.0, 10],
  [16, -40, 3.0, 18],
  [-18, -44, 2.6, 15],
];

export const FieldScene: React.FC = () => (
  <>
    <ambientLight intensity={0.85} />
    <hemisphereLight args={["#3a3a4a", "#000000", 0.5]} />
    <directionalLight position={[4, 14, 9]} intensity={1.7} />
    <pointLight position={[-14, 4, -10]} intensity={70} color="#5a6cff" />
    <pointLight position={[16, 4, 8]} intensity={60} color="#ffb347" />
    <spotLight position={[0, 18, 6]} angle={0.7} penumbra={1} intensity={600} color="#dfe6ff" />

    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[160, 160]} />
      <meshStandardMaterial color={FLOOR} roughness={0.95} metalness={0} />
    </mesh>
    <gridHelper args={[110, 66, GRID_A, GRID_B]} position={[0, 0.01, 0]} />

    {MONOLITHS.map(([x, z, w, h], i) => (
      <mesh key={i} position={[x, h / 2, z]}>
        <boxGeometry args={[w, h, 0.9]} />
        <meshStandardMaterial color={MONOLITH} roughness={0.92} metalness={0.05} />
      </mesh>
    ))}
    <DustMotes speed={0.15} color={DUST} />
  </>
);
