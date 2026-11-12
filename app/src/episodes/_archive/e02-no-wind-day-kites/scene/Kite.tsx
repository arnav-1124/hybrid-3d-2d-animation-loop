// A diamond kite: fabric + crossed spars + a live tail, plus the string curve.
// All geometry comes from the lane state — deterministic per frame.
import React, { useMemo } from "react";
import * as THREE from "three";
import { useCurrentFrame } from "remotion";
import { shade } from "../../../shared/palette";
import { Strut } from "../../../shared/three/Strut";
import { SPAR, STRING_C } from "../palette";

// Half-diagonal of the fabric diamond after the group's aspect scale.
export const NOSE_OFF = 0.81;

export const Kite: React.FC<{
  pos: [number, number, number];
  tilt: number;
  sway: number;
  color: string;
  dim: number;
}> = ({ pos, tilt, sway, color, dim }) => {
  const frame = useCurrentFrame();
  const fabric = shade(color, dim);
  const spar = shade(SPAR, dim);
  return (
    <group position={pos} rotation={[0.12, 0, tilt]}>
      <group scale={[0.94, 1.31, 1]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.87, 0.87]} />
          <meshStandardMaterial
            color={fabric}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
            roughness={0.85}
          />
        </mesh>
        <Strut a={[0, -0.615, 0]} b={[0, 0.615, 0]} r={0.02} color={spar} />
        <Strut a={[-0.615, 0, 0]} b={[0.615, 0, 0]} r={0.018} color={spar} />
      </group>
      {/* Tail: little bows swinging off the bottom vertex */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((frame + i * 11) * 0.1) * 0.2 * sway - i * 0.06,
            -NOSE_OFF - 0.34 * (i + 1) + Math.cos((frame + i * 7) * 0.12) * 0.05 * sway,
            0.02,
          ]}
          rotation={[0, 0, Math.sin((frame + i * 5) * 0.14) * 0.5 * sway]}
        >
          <planeGeometry args={[0.15, 0.22]} />
          <meshStandardMaterial
            color={fabric}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  );
};

// Slack string: a quadratic-bezier polyline from the anchor to the kite nose,
// sagging by `slack`. Thin line segments read as string at any distance.
export const StringCurve: React.FC<{
  anchor: [number, number, number];
  nose: [number, number, number];
  slack: number;
  dim: number;
}> = ({ anchor, nose, slack, dim }) => {
  const pts = useMemo(() => {
    const N = 12;
    const arr = new Float32Array((N + 1) * 3);
    const mx = (anchor[0] + nose[0]) / 2;
    const my = (anchor[1] + nose[1]) / 2 - slack;
    const mz = (anchor[2] + nose[2]) / 2;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const w = 1 - u;
      arr[i * 3] = w * w * anchor[0] + 2 * w * u * mx + u * u * nose[0];
      arr[i * 3 + 1] = w * w * anchor[1] + 2 * w * u * my + u * u * nose[1];
      arr[i * 3 + 2] = w * w * anchor[2] + 2 * w * u * mz + u * u * nose[2];
    }
    return arr;
  }, [anchor[0], anchor[1], anchor[2], nose[0], nose[1], nose[2], slack]);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pts, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={shade(STRING_C, dim)} transparent opacity={0.65} />
    </lineSegments>
  );
};
