// "The Wheel" timeline. 1080x1920 @ 30fps, 465 frames (15.5s).
// Every function here is a pure function of the frame index.
// Camera lives in ./camera.ts (one continuous path — RULE 5).

import { PoseStyle, RUN, STAND, WALK } from "../../shared/stickman/pose";
import type { V3 } from "../../shared/types";
import { interpolate } from "remotion";

export const FPS = 30;
export const TOTAL_FRAMES = 465; // 15.5s — punchy reference cadence (9–15.5s)

// Key beats (frames). Reference pacing: something changes every ~1–2.5s.
export const T = {
  fadeInEnd: 8,
  camPullStart: 120, // 4.0s  — pull-out reveal starts
  camPullEnd: 200, // 6.7s  — reveal lands
  decelStart: 225, // 7.5s  — wheel starts dying
  decelEnd: 262, // 8.7s  — wheel stops; dim starts
  lookStart: 265,
  lookPeak: 274,
  lookEnd: 288,
  hopStart: 292, // 9.7s
  hopEnd: 322, // 10.7s
  walkStart: 322,
  text1: [8, 108] as const, // "FULL SPEED. EVERY DAY."
  text2: [150, 218] as const, // "SO WHERE IS ALL THIS GOING?"
  text3: [272, 445] as const, // "MOTION ISN'T PROGRESS."
  hero: [285, 445] as const, // "Direction is." — HERO line, biggest on screen
  fadeOutStart: 445,
};

// Speed profile: full speed from frame 0 (hook), spins down during the reveal beat.
const speedAt = (f: number): number => {
  if (f <= T.decelStart) return 1;
  if (f >= T.decelEnd) return 0;
  const t = (f - T.decelStart) / (T.decelEnd - T.decelStart);
  return Math.pow(1 - t, 1.7);
};

// Integrated angle tables so wheel spin + leg cycle decelerate perfectly in sync.
const cum: number[] = new Array(TOTAL_FRAMES + 1);
cum[0] = 0;
for (let f = 1; f <= TOTAL_FRAMES; f++) {
  cum[f] = cum[f - 1] + speedAt(f) / FPS;
}

export const WHEEL_RATE = 3.6; // rad/s at full speed
export const RUN_RATE = 11; // leg cycle rad/s at full speed
export const WALK_RATE = 5.4;
export const WALK_SPEED = 1.7; // world units/s

export const wheelAngle = (f: number) => cum[Math.min(f, TOTAL_FRAMES)] * WHEEL_RATE;
export const runPhase = (f: number) => cum[Math.min(f, TOTAL_FRAMES)] * RUN_RATE;
export const speedProfile = speedAt;

export const WHEEL_INNER_FLOOR_Y = 0.47; // feet baseline inside the wheel

export interface StickState {
  root: V3; // feet baseline position in world space
  phase: number;
  a: PoseStyle;
  b: PoseStyle;
  mix: number; // 0 -> style a, 1 -> style b
  headPitch: number;
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function stickState(f: number): StickState {
  // 1) Sprinting inside the wheel
  if (f < T.decelEnd) {
    return {
      root: [0, WHEEL_INNER_FLOOR_Y, 0],
      phase: runPhase(f),
      a: RUN,
      b: RUN,
      mix: 0,
      headPitch: 0,
    };
  }

  // 2) Stopped. The realization: looks up at where he was heading. Nothing there.
  if (f < T.hopStart) {
    const mix = easeInOut(clamp01((f - T.decelEnd) / 18));
    let look = 0;
    if (f >= T.lookStart && f < T.lookEnd) {
      look = -0.55 * easeInOut(clamp01((f - T.lookStart) / (T.lookPeak - T.lookStart)));
    } else if (f >= T.lookEnd) {
      look = -0.55 * (1 - easeInOut(clamp01((f - T.lookEnd) / (T.hopStart - T.lookEnd))));
    }
    return {
      root: [0, WHEEL_INNER_FLOOR_Y, 0],
      phase: 0.3, // frozen mid-stride so both legs don't merge into one column
      a: RUN,
      b: STAND,
      mix,
      headPitch: look,
    };
  }

  // 3) Hop off the wheel
  if (f < T.hopEnd) {
    const t = clamp01((f - T.hopStart) / (T.hopEnd - T.hopStart));
    const e = easeInOut(t);
    const x = 0.75 * e;
    const z = 1.6 * e;
    const y = WHEEL_INNER_FLOOR_Y * (1 - t) + 0.9 * 4 * t * (1 - t);
    return {
      root: [x, y, z],
      phase: 0,
      a: STAND,
      b: WALK,
      mix: clamp01(t * 1.6),
      headPitch: 0,
    };
  }

  // 4) Walking away, off frame (~f435 at this speed)
  const w = f - T.walkStart;
  return {
    root: [0.75 + (WALK_SPEED * w) / FPS, 0, 1.6],
    phase: (WALK_RATE * w) / FPS,
    a: WALK,
    b: WALK,
    mix: 0,
    headPitch: 0,
  };
}

// Mood dim: the world goes quiet/gray when he stops (the "payoff flip").
// Rendered over the 3D, under the text.
export function moodDim(f: number): number {
  return interpolate(f, [T.decelStart, T.decelEnd, T.hopEnd, T.fadeOutStart], [0, 0.5, 0.32, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
