import React, { useMemo } from "react";
import * as THREE from "three";
import type { V3 } from "../types";

// Cylinder strut from point a to point b (aligns a Y-up cylinder via quaternion).
// `r` is the radius at a, `r2` the radius at b — a taper is what stops limbs
// reading as uniform pipes. Both default to the same value (a plain tube).
export const Strut: React.FC<{
  a: V3;
  b: V3;
  r: number;
  r2?: number;
  segments?: number;
  color: string;
  roughness?: number;
  metalness?: number;
}> = ({ a, b, r, r2, segments = 14, color, roughness = 0.55, metalness = 0.15 }) => {
  const { mid, quat, len } = useMemo(() => {
    const av = new THREE.Vector3(a[0], a[1], a[2]);
    const bv = new THREE.Vector3(b[0], b[1], b[2]);
    const dir = new THREE.Vector3().subVectors(bv, av);
    const l = Math.max(0.0001, dir.length());
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );
    const m = new THREE.Vector3().addVectors(av, bv).multiplyScalar(0.5);
    return { mid: m, quat: q, len: l };
  }, [a[0], a[1], a[2], b[0], b[1], b[2], r]);

  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={[quat.x, quat.y, quat.z, quat.w]}>
      <cylinderGeometry args={[r2 ?? r, r, len, segments]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
};
