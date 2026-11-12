import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HEAD_R, Joints, mixStyle, PoseStyle, pose2D } from "./pose";
import { shade } from "../palette";
import { Strut } from "../three/Strut";
import type { V2, V3 } from "../types";

const NEAR_Z = 0.1;
const FAR_Z = -0.1;
const NEAR_COLOR = "#f6f6fa";
const FAR_COLOR = "#9a9cad";
const BODY_COLOR = "#f6f6fa";

// A tight-ish highlight is what sells a rounded 3D form under the panel lights.
// Fully matte tubes read as flat paper cut-outs, which is what we had.
const SKIN_ROUGHNESS = 0.44;
const SKIN_METALNESS = 0.04;

const lift = (p: V2, z: number): V3 => [p[0], p[1], z];

const mixV2 = (a: V2, b: V2, t: number): V2 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];
const mixV3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

// Deterministic hash — "random" per drop, identical every render. Remotion
// needs frame-exact reproducibility, so no Math.random() anywhere.
const rnd = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const smooth = (t: number): number => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

// --- Life element: sweat. Each droplet has its own spawn point on the head,
// its own rhythm, launch flick, drag and gravity — so they never pulse in
// lockstep or slide along one fixed line. ---
const SWEAT_DROPS = 22;

const Sweat: React.FC<{ sweat: number; head: V2; dim: number }> = ({ sweat, head, dim }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strength = smooth((sweat - 0.05) / 0.95);
  if (strength <= 0.002) return null;
  const t = frame / fps;
  const color = shade("#dceeff", Math.max(0.25, dim));
  const drops: React.ReactNode[] = [];

  for (let i = 0; i < SWEAT_DROPS; i++) {
    const r1 = rnd(i * 1.13 + 0.7);
    const r2 = rnd(i * 2.31 + 3.1);
    const r3 = rnd(i * 3.77 + 5.9);
    const r4 = rnd(i * 4.19 + 9.3);
    const r5 = rnd(i * 5.53 + 13.7);
    const r6 = rnd(i * 6.71 + 17.1);
    const r7 = rnd(i * 7.97 + 21.5);

    // Density scales with effort: a sheen at 0.4, a spray at 1.0.
    if (r3 > 0.12 + 0.88 * strength) continue;

    const period = 0.36 + r1 * 0.26; // a flick is short: ~0.36-0.62s in the air
    const phase = ((t / period + r2) % 1 + 1) % 1;
    const age = phase * period;

    // Spawn on the crown / temples / chin of the head.
    const x0 = head[0] + (r4 - 0.5) * 0.12;
    const y0 = head[1] + HEAD_R * (0.15 + r5 * 0.8);
    const z0 = (r6 - 0.5) * 0.16;

    // A real flick: mostly backward, a little upward, then gravity wins.
    const vx = -(0.65 + r5 * 0.95);
    const vy = 0.2 + r6 * 0.6;
    const g = 7.9;
    const drag = 0.9;

    const x = x0 + (vx * age) / (1 + drag * age);
    const y = y0 + vy * age - 0.5 * g * age * age;
    const vxNow = vx / Math.pow(1 + drag * age, 2);
    const vyNow = vy - g * age;
    const speed = Math.hypot(vxNow, vyNow);
    if (y < 0.02) continue; // already on the floor

    const fadeIn = smooth(age / 0.05);
    const fadeOut = smooth((period - age) / 0.16);
    const floorFade = smooth((y - 0.02) / 0.32);
    const op = strength * fadeIn * fadeOut * floorFade * (0.62 + 0.33 * r7);
    if (op <= 0.004) continue;

    const size = 0.009 + 0.016 * r7;
    // Stretch along travel: a moving drop reads as a streak, not a marble.
    const stretch = 1 + Math.min(1.15, speed * 0.22);
    // Rotate local +Y onto the velocity vector.
    const angle = Math.atan2(-vxNow, vyNow);

    drops.push(
      <group key={i} position={[x, y, z0]} rotation={[0, 0, angle]}>
        <mesh scale={[1, stretch, 1]}>
          <sphereGeometry args={[size, 10, 8]} />
          <meshStandardMaterial
            color={color}
            emissive="#4a7fa6"
            emissiveIntensity={0.22}
            roughness={0.06}
            metalness={0.05}
            transparent
            opacity={op}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  }

  return <group>{drops}</group>;
};

// -- Joint / extremity caps ---------------------------------------------------
// Limbs meeting at an angle leave a visible crease with bare cylinders; a
// sphere at each joint closes the seam and reads as a rounded body part.
const Joint: React.FC<{
  p: V2;
  z: number;
  r: number;
  color: string;
  scale?: [number, number, number];
}> = ({ p, z, r, color, scale = [1, 1, 1] }) => (
  <mesh position={[p[0], p[1], z]} scale={scale}>
    <sphereGeometry args={[r, 14, 12]} />
    <meshStandardMaterial color={color} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
  </mesh>
);

// --- Kit ---------------------------------------------------------------------
// Clothes are primitives fitted over the SAME joints the limbs use, so they
// follow every rep exactly with no skinning: a vest over the torso with stub
// sleeves over the upper arms, shorts over the hips and top of the thighs, and
// shoes over the feet. Every piece is drawn a hair wider than the limb beneath
// it, so the limb never pokes through.
export interface Kit {
  top: string;
  bottom: string;
  shoe: string;
  hair: string;
}

const CLOTH = { roughness: 0.8, metalness: 0.02 };

const Outfit: React.FC<{ j: Joints; kit: Kit }> = ({ j, kit }) => {
  const F = (p: V2) => lift(p, NEAR_Z);
  const B = (p: V2) => lift(p, FAR_Z);
  const C = (p: V2) => lift(p, 0);
  const legR = { hip: 0.094, mid: 0.076 };
  return (
    <>
      {/* far side: sleeve + short leg (drawn first, behind the body) */}
      <Strut
        a={C(j.chest)}
        b={mixV3(C(j.chest), B(j.elbowB), 0.6)}
        r={0.078}
        r2={0.064}
        color={kit.top}
        {...CLOTH}
      />
      <Strut
        a={C(j.hip)}
        b={mixV3(C(j.hip), B(j.kneeB), 0.58)}
        r={legR.hip - 0.008}
        r2={legR.mid - 0.008}
        color={kit.bottom}
        {...CLOTH}
      />

      {/* vest over the torso, rounded shoulder yoke, crew collar */}
      <Strut
        a={C(mixV2(j.hip, j.chest, 0.02))}
        b={C(j.chest)}
        r={0.092}
        r2={0.116}
        segments={20}
        color={kit.top}
        {...CLOTH}
      />
      <Joint p={j.chest} z={0} r={0.118} color={kit.top} scale={[1.06, 0.82, 1.1]} />
      <Strut
        a={C(mixV2(j.chest, j.head, 0.1))}
        b={C(mixV2(j.chest, j.head, 0.34))}
        r={0.076}
        r2={0.058}
        color={kit.top}
        {...CLOTH}
      />
      {/* shorts block over the hips */}
      <Joint p={mixV2(j.hip, j.chest, 0.02)} z={0} r={0.1} color={kit.bottom} scale={[0.98, 0.82, 1.08]} />

      {/* near side: sleeve + short leg */}
      <Strut
        a={C(j.chest)}
        b={mixV3(C(j.chest), F(j.elbowF), 0.6)}
        r={0.084}
        r2={0.07}
        color={kit.top}
        {...CLOTH}
      />
      <Strut
        a={C(j.hip)}
        b={mixV3(C(j.hip), F(j.kneeF), 0.58)}
        r={legR.hip}
        r2={legR.mid}
        color={kit.bottom}
        {...CLOTH}
      />

      {/* shoes */}
      <Joint p={j.footF} z={NEAR_Z} r={0.055} color={kit.shoe} scale={[1.6, 0.7, 1.1]} />
      <Joint p={j.footB} z={FAR_Z} r={0.05} color={kit.shoe} scale={[1.6, 0.7, 1.1]} />

      {/* hair cap — the one thing that stops a bare sphere reading as a head */}
      <mesh position={C(j.head)} rotation={[0, 0, 0.46]}>
        <sphereGeometry args={[HEAD_R * 1.03, 26, 18, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
        <meshStandardMaterial color={kit.hair} roughness={0.9} metalness={0.02} />
      </mesh>
    </>
  );
};

export const Stickman3D: React.FC<{
  root: V3;
  phase: number;
  a: PoseStyle;
  b: PoseStyle;
  mix: number;
  headPitch: number;
  sweat: number;
  /** Full joint override (authored static poses). Wins over a/b/mix when set. */
  joints?: Joints;
  /** Facing rotation around Y: 0 = +X, PI = -X. */
  yaw?: number;
  /** Brightness multiplier for the whole body (1 = normal) — the v7-style
   *  "dim the losers" ending. */
  brightness?: number;
  /** Optional gym kit (vest / shorts / shoes) drawn over the body. */
  kit?: Kit;
}> = ({ root, phase, a, b, mix, headPitch, sweat, joints, yaw = 0, brightness = 1, kit }) => {
  const st = mixStyle(a, b, mix);
  const j: Joints = joints ?? pose2D(phase, st, headPitch);

  const F = (p: V2) => lift(p, NEAR_Z);
  const B = (p: V2) => lift(p, FAR_Z);
  const C = (p: V2) => lift(p, 0);
  const near = shade(NEAR_COLOR, brightness);
  const far = shade(FAR_COLOR, brightness);
  const body = shade(BODY_COLOR, brightness);

  return (
    <group position={root} rotation={[0, yaw, 0]}>
      {/* Far limbs (drawn first, darker = depth) */}
      <Strut a={C(j.hip)} b={B(j.kneeB)} r={0.064} r2={0.046} color={far} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={B(j.kneeB)} b={B(j.footB)} r={0.048} r2={0.032} color={far} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={C(j.chest)} b={B(j.elbowB)} r={0.054} r2={0.04} color={far} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={B(j.elbowB)} b={B(j.handB)} r={0.04} r2={0.028} color={far} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Joint p={j.kneeB} z={FAR_Z} r={0.046} color={far} />
      <Joint p={j.elbowB} z={FAR_Z} r={0.04} color={far} />
      <Joint p={j.footB} z={FAR_Z} r={0.038} color={far} scale={[1.25, 0.6, 0.9]} />
      <Joint p={j.handB} z={FAR_Z} r={0.045} color={far} scale={[1, 0.9, 1]} />

      {/* Body + head */}
      <Strut a={C(j.hip)} b={C(j.chest)} r={0.074} r2={0.1} color={body} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={C(j.chest)} b={C(j.head)} r={0.05} r2={0.036} color={body} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Joint p={j.hip} z={0} r={0.088} color={body} />
      <Joint p={j.chest} z={0} r={0.098} color={body} />
      <mesh position={C(j.head)}>
        <sphereGeometry args={[HEAD_R, 32, 24]} />
        <meshStandardMaterial color={body} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      </mesh>

      {/* Near limbs */}
      <Strut a={C(j.hip)} b={F(j.kneeF)} r={0.072} r2={0.05} color={near} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={F(j.kneeF)} b={F(j.footF)} r={0.054} r2={0.036} color={near} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={C(j.chest)} b={F(j.elbowF)} r={0.058} r2={0.042} color={near} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Strut a={F(j.elbowF)} b={F(j.handF)} r={0.042} r2={0.03} color={near} roughness={SKIN_ROUGHNESS} metalness={SKIN_METALNESS} />
      <Joint p={j.kneeF} z={NEAR_Z} r={0.05} color={near} />
      <Joint p={j.elbowF} z={NEAR_Z} r={0.042} color={near} />
      <Joint p={j.footF} z={NEAR_Z} r={0.042} color={near} scale={[1.25, 0.6, 0.9]} />
      <Joint p={j.handF} z={NEAR_Z} r={0.05} color={near} scale={[1, 0.9, 1]} />

      {kit && <Outfit j={j} kit={kit} />}

      <Sweat sweat={sweat} head={j.head} dim={brightness} />
    </group>
  );
};
