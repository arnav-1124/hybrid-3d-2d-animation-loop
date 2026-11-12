// Per-panel runtime state for e02. Everything is a pure function of the frame.
import type { Joints } from "../../../shared/stickman/pose";

export interface RepState {
  joints: Joints; // bar-space: bar at y=BAR_Y, floor at y=0
  yaw: number; // facing: 0 = +X (screen right), PI = -X
  headPitch: number;
  sweat: number;
}

export const easeIn = (t: number): number => t * t;
export const easeOut = (t: number): number => 1 - (1 - t) * (1 - t);
export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
