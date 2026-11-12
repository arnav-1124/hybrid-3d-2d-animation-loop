// Pull-up rig poses, authored in bar-space (bar line at y=BAR_Y, floor at y=0).
// Hands stay glued to the bar in both extremes; mixJoints sweeps the body
// between them — a continuous rep, no cuts. Limb lengths are matched to the
// rig (THIGH/SHIN/TORSO/ARM) within a few percent; small offsets read as
// foreshortening on a stick figure.
import {
  pose2D,
  STAND,
  HANG_BOTTOM,
  HANG_TOP,
  Joints,
  mixJoints,
} from "../../../shared/stickman/pose";
import type { V2 } from "../../../shared/types";
import { BAR_Y } from "../rig";
import { clamp01, easeIn, easeInOut } from "./types";

// Re-exported for the character modules — the hang poses are the rig's alphabet.
export { HANG_BOTTOM, HANG_TOP };

// Dead hang — arms locked, body straight below the bar, feet off the floor.
export const DEAD_HANG: Joints = {
  handF: v(0.09, BAR_Y), handB: v(-0.09, BAR_Y),
  elbowF: v(0.06, 2.33), elbowB: v(-0.06, 2.33),
  chest: v(0.02, 1.88), head: v(0.17, 2.07), // head drooped forward
  hip: v(0.02, 1.26),
  kneeF: v(0.09, 0.75), footF: v(0.14, 0.26),
  kneeB: v(-0.06, 0.74), footB: v(0.0, 0.25),
};

// Released and falling — arms flung back-down, legs striding to catch the floor.
export const FALLING: Joints = {
  handF: v(-0.32, 1.12), handB: v(-0.38, 1.09),
  elbowF: v(-0.16, 1.46), elbowB: v(-0.2, 1.44),
  chest: v(0.04, 1.82), head: v(0.09, 2.03),
  hip: v(0.01, 1.2),
  kneeF: v(0.17, 0.68), footF: v(0.31, 0.18),
  kneeB: v(-0.13, 0.7), footB: v(-0.02, 0.24),
};

function v(x: number, y: number): V2 {
  return [x, y];
}

// One rep: t = 0 (dead hang) -> 1 (chin over the bar) -> back. `shape` lets
// each character pull with his own style (burst, slow grind, ...); the shape
// must still hit exactly 0 and 1 at the ends so the extremes stay clean.
export const repPose = (
  t: number,
  shape: (u: number) => number = evenShape
): Joints => mixJoints(HANG_BOTTOM, HANG_TOP, shape(clamp01(t)));

// Plain pull: eased there, eased back. STEADY's metronome.
export const evenShape = (u: number): number => easeInOut(u);

// Jump + grab: standing -> hanging in 12 frames, accelerating (a real hop).
export const mountPose = (f: number, mountStart: number): Joints => {
  const u = easeIn(clamp01((f - mountStart) / 12));
  return mixJoints(pose2D(0, STAND, 0), HANG_BOTTOM, u);
};
