// 2D stickman rig math. Pure functions of (phase, style) so every frame is deterministic.
// The stickman faces +X and stands on Y=0. It gets placed into 3D space by Stickman3D.

import type { V2 } from "../types";

// Body dimensions (world units)
export const S = 0.85;
export const THIGH = 0.62 * S;
export const SHIN = 0.58 * S;
export const TORSO = 0.72 * S;
export const NECK = 0.1 * S;
export const HEAD_R = 0.17 * S;
export const ARM_U = 0.5 * S;
export const ARM_L = 0.46 * S;
export const LEG = THIGH + SHIN;

export interface PoseStyle {
  thigh: number; // leg swing amplitude (rad)
  kneeBase: number;
  kneeSwing: number; // extra bend mid-swing
  kneeTrail: number; // bend when trailing behind
  arm: number; // arm swing amplitude
  elbow: number; // fixed elbow bend
  lean: number; // torso lean forward (rad)
  bob: number; // vertical bounce amplitude
  hipHeight: number; // fraction of leg length
}

export const RUN: PoseStyle = {
  thigh: 0.95,
  kneeBase: 0.35,
  kneeSwing: 1.25,
  kneeTrail: 0.55,
  arm: 0.85,
  elbow: 1.6,
  lean: 0.3,
  bob: 0.06,
  hipHeight: 0.93,
};

export const WALK: PoseStyle = {
  thigh: 0.42,
  kneeBase: 0.08,
  kneeSwing: 0.42,
  kneeTrail: 0.08,
  arm: 0.38,
  elbow: 0.45,
  lean: 0.05,
  bob: 0.025,
  hipHeight: 0.99,
};

export const STAND: PoseStyle = {
  thigh: 0,
  kneeBase: 0.08,
  kneeSwing: 0,
  kneeTrail: 0,
  arm: 0,
  elbow: 0.25,
  lean: 0.02,
  bob: 0.005,
  hipHeight: 0.995,
};

export interface Joints {
  hip: V2;
  chest: V2;
  head: V2;
  elbowF: V2;
  handF: V2;
  elbowB: V2;
  handB: V2;
  kneeF: V2;
  footF: V2;
  kneeB: V2;
  footB: V2;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function mixStyle(a: PoseStyle, b: PoseStyle, t: number): PoseStyle {
  const m = clamp01(t);
  return {
    thigh: lerp(a.thigh, b.thigh, m),
    kneeBase: lerp(a.kneeBase, b.kneeBase, m),
    kneeSwing: lerp(a.kneeSwing, b.kneeSwing, m),
    kneeTrail: lerp(a.kneeTrail, b.kneeTrail, m),
    arm: lerp(a.arm, b.arm, m),
    elbow: lerp(a.elbow, b.elbow, m),
    lean: lerp(a.lean, b.lean, m),
    bob: lerp(a.bob, b.bob, m),
    hipHeight: lerp(a.hipHeight, b.hipHeight, m),
  };
}

const legLimb = (hip: V2, st: PoseStyle, phase: number): { knee: V2; foot: V2 } => {
  const ta = st.thigh * Math.sin(phase);
  const kneeB =
    st.kneeBase +
    st.kneeSwing * Math.max(0, Math.cos(phase)) +
    st.kneeTrail * Math.max(0, -Math.sin(phase));
  const knee: V2 = [hip[0] + THIGH * Math.sin(ta), hip[1] - THIGH * Math.cos(ta)];
  const sa = ta - kneeB; // shin bends backward relative to thigh
  const foot: V2 = [knee[0] + SHIN * Math.sin(sa), knee[1] - SHIN * Math.cos(sa)];
  return { knee, foot };
};

const armLimb = (shoulder: V2, st: PoseStyle, phase: number): { elbow: V2; hand: V2 } => {
  const ua = -st.arm * Math.sin(phase) + st.lean * 0.6;
  const elbow: V2 = [shoulder[0] + ARM_U * Math.sin(ua), shoulder[1] - ARM_U * Math.cos(ua)];
  const fa = ua + st.elbow; // forearm folds forward
  const hand: V2 = [elbow[0] + ARM_L * Math.sin(fa), elbow[1] - ARM_L * Math.cos(fa)];
  return { elbow, hand };
};

export function pose2D(phase: number, st: PoseStyle, headPitch = 0): Joints {
  const hipY = LEG * st.hipHeight + st.bob * Math.sin(2 * phase);
  const hip: V2 = [0, hipY];
  const chest: V2 = [hip[0] + TORSO * Math.sin(st.lean), hip[1] + TORSO * Math.cos(st.lean)];
  const headA = st.lean + headPitch;
  const headDist = NECK + HEAD_R * 0.95;
  const head: V2 = [chest[0] + headDist * Math.sin(headA), chest[1] + headDist * Math.cos(headA)];

  const nearLeg = legLimb(hip, st, phase);
  const farLeg = legLimb(hip, st, phase + Math.PI);
  const nearArm = armLimb(chest, st, phase + Math.PI); // near arm works opposite near leg
  const farArm = armLimb(chest, st, phase);

  return {
    hip,
    chest,
    head,
    elbowF: nearArm.elbow,
    handF: nearArm.hand,
    elbowB: farArm.elbow,
    handB: farArm.hand,
    kneeF: nearLeg.knee,
    footF: nearLeg.foot,
    kneeB: farLeg.knee,
    footB: farLeg.foot,
  };
}

// --- Authored static poses (full joint layouts, via Stickman3D's `joints`) ---
// The cyclic rig can't reach these shapes (both legs forward, akimbo arms...),
// so they are hand-placed in the same 2D space: +X forward, feet baseline y=0.
export const SIT_POSE: Joints = {
  hip: [0, 0.5],
  chest: [0.1, 1.06],
  head: [0.17, 1.22],
  elbowF: [0.26, 0.8],
  handF: [0.4, 0.5],
  elbowB: [0.2, 0.76],
  handB: [0.33, 0.46],
  kneeF: [0.44, 0.42],
  footF: [0.32, 0.06],
  kneeB: [0.36, 0.38],
  footB: [0.25, 0.05],
};

export const BENT_POSE: Joints = {
  hip: [0, 0.9],
  chest: [0.34, 1.38],
  head: [0.44, 1.5],
  elbowF: [0.44, 1.06],
  handF: [0.42, 0.72],
  elbowB: [0.4, 1.02],
  handB: [0.36, 0.7],
  kneeF: [0.1, 0.5],
  footF: [0.06, 0.02],
  kneeB: [-0.06, 0.48],
  footB: [-0.1, 0.02],
};

export const THROW_POSE: Joints = {
  hip: [0, 1.0],
  chest: [-0.03, 1.62],
  head: [-0.04, 1.79],
  elbowF: [-0.06, 2.02],
  handF: [-0.14, 2.36],
  elbowB: [0.3, 1.45],
  handB: [0.44, 1.2],
  kneeF: [0.22, 0.52],
  footF: [0.34, 0.03],
  kneeB: [-0.1, 0.5],
  footB: [-0.18, 0.02],
};

export const POSE_PROUD: Joints = {
  hip: [0, 1.02],
  chest: [-0.08, 1.66],
  head: [-0.12, 1.84],
  elbowF: [0.34, 1.3],
  handF: [0.3, 0.98],
  elbowB: [-0.3, 1.28],
  handB: [-0.26, 0.96],
  kneeF: [0.06, 0.52],
  footF: [0.1, 0.02],
  kneeB: [-0.06, 0.52],
  footB: [-0.1, 0.02],
};

// Hanging poses for e02's pull-up rig, authored in BAR-space: the bar line
// sits at y = 2.72 (both hands glued to it in both extremes), the floor at
// y = 0. mixJoints sweeps between them — a continuous rep, hands never move.
export const HANG_BOTTOM: Joints = {
  hip: [0, 1.28],
  chest: [0, 1.9],
  head: [0.02, 2.12],
  elbowF: [0.06, 2.33],
  handF: [0.09, 2.72],
  elbowB: [-0.06, 2.33],
  handB: [-0.09, 2.72],
  kneeF: [0.04, 0.76],
  footF: [0.03, 0.26],
  kneeB: [-0.05, 0.75],
  footB: [-0.08, 0.25],
};

export const HANG_TOP: Joints = {
  hip: [0.03, 2.04],
  chest: [0, 2.66],
  head: [0.05, 2.88], // head center above the bar = chin over
  elbowF: [0.26, 2.34],
  handF: [0.09, 2.72],
  elbowB: [-0.24, 2.36],
  handB: [-0.09, 2.72],
  kneeF: [0.15, 1.54],
  footF: [0.21, 1.08],
  kneeB: [-0.01, 1.52],
  footB: [0.05, 1.06],
};

const lerpV2 = (a: V2, b: V2, t: number): V2 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

// Cross-fade between any two joint layouts (static pose <-> cyclic gait, etc.).
export function mixJoints(a: Joints, b: Joints, t: number): Joints {
  const m = clamp01(t);
  return {
    hip: lerpV2(a.hip, b.hip, m),
    chest: lerpV2(a.chest, b.chest, m),
    head: lerpV2(a.head, b.head, m),
    elbowF: lerpV2(a.elbowF, b.elbowF, m),
    handF: lerpV2(a.handF, b.handF, m),
    elbowB: lerpV2(a.elbowB, b.elbowB, m),
    handB: lerpV2(a.handB, b.handB, m),
    kneeF: lerpV2(a.kneeF, b.kneeF, m),
    footF: lerpV2(a.footF, b.footF, m),
    kneeB: lerpV2(a.kneeB, b.kneeB, m),
    footB: lerpV2(a.footB, b.footB, m),
  };
}
