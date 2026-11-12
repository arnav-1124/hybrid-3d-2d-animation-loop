// Per-lane runtime state for e02. Everything is a pure function of the frame.
import type { Joints } from "../../../shared/stickman/pose";
import type { V3 } from "../../../shared/types";

export interface KiteState {
  pos: V3; // kite center in world space
  tilt: number; // rotation around Z (0 = nose up; negative = crashed/leaning)
  sway: number; // tail sway amplitude (0..1)
  anchor: V3; // world point the string hangs from (hand / pole top)
  slack: number; // string sag in world units
}

export interface LaneState {
  root: V3;
  joints: Joints;
  yaw: number; // facing: 0 = +X, PI = -X
  headPitch: number;
  sweat: number;
  kite: KiteState;
  flash: number; // camera-flash pulse (SHOWMAN only)
}

export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
export const mixV3 = (a: V3, b: V3, t: number): V3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

// Triangle wave 0..1..0 over `period` frames, plus the travel direction.
export const tri = (f: number, period: number): number => {
  const t = (((f % period) + period) % period) / period;
  return t < 0.5 ? t * 2 : 2 - t * 2;
};
export const triDir = (f: number, period: number): number =>
  (((f % period) + period) % period) < period / 2 ? 1 : -1;

// Smooth facing yaw for a back-and-forth patrol: 0 (facing +X) on the way out,
// PI on the way back, with a short ease at each turn point.
export const patrolYaw = (f: number, period: number, easeFrames = 7): number => {
  const p = ((f % period) + period) % period;
  const half = period / 2;
  const dTurn = Math.min(p, Math.abs(p - period), Math.abs(p - half));
  const s = easeInOut(clamp01(dTurn / easeFrames));
  return p < half ? Math.PI * (1 - s) : Math.PI * s;
};
