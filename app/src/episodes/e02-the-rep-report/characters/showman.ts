// SHOWMAN — every rep is staged. Slow grind up, a held pose at the top, slow
// lower. Quits ON the bar at 310 but grinds the rest of that pull anyway —
// the top pose was the point. The counter froze at 3 at the quit: uncounted.
import {
  FALLING,
  HANG_BOTTOM,
  mountPose,
  repPose,
} from "./hang";
import { pose2D, STAND, POSE_PROUD, mixJoints, type Joints } from "../../../shared/stickman/pose";
import type { RepState } from "./types";
import { easeInOut, easeOut } from "./types";
import { T } from "../timeline";

const START = 60; // rep cycles begin (mount = T.mount.show = 48)
const PERIOD = 80;
const QUIT = T.showQuit; // 310 — mid 4th pull

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

// Rep position for cycle-phase p (pull 0-35%, held top 35-65%, lower 65-100%).
const shapeT = (p: number): number => {
  if (p < 0.35) return easeInOut(p / 0.35);
  if (p < 0.65) return 1 - 0.02 * (0.5 + 0.5 * Math.sin(p * PERIOD * 0.18));
  return 1 - easeInOut((p - 0.65) / 0.35);
};
// Where he hangs when he quits (p at f=309, the last counted-cycle frame).
const QUIT_T = shapeT((((QUIT - 1 - START) % PERIOD) + PERIOD) % PERIOD / PERIOD);

// His bow variant: POSE_PROUD with the head dipped — the slow "thank you" nod.
const PROUD_BOW: Joints = {
  ...POSE_PROUD,
  chest: [-0.04, 1.64],
  head: [0.06, 1.78],
};

export function showman(f: number): RepState {
  let joints: Joints;

  if (f < START) {
    // Waiting: a barely-visible weight shift while the others get set.
    joints = pose2D(0.05 * Math.sin(f * 0.06), STAND, 0);
  } else if (f < QUIT) {
    joints = repPose(shapeT((((f - START) % PERIOD) + PERIOD) % PERIOD / PERIOD));
  } else {
    // Vanity: grinds the quit pull to the FULL top, holds it, lowers, poses.
    if (f < 345) {
      joints = repPose(QUIT_T + (1 - QUIT_T) * easeInOut((f - QUIT) / 35));
    } else if (f < 395) {
      joints = repPose(1 - 0.02 * (0.5 + 0.5 * Math.sin((f - 345) * 0.18)));
    } else if (f < 435) {
      joints = repPose(mix(0.98, 0.05, easeInOut((f - 395) / 40)));
    } else if (f < 445) {
      joints = repPose(0.05 * (1 - (f - 435) / 10));
    } else if (f < 457) {
      joints = mixJoints(HANG_BOTTOM, FALLING, easeInOut((f - 445) / 12));
    } else if (f < 470) {
      joints = mixJoints(FALLING, pose2D(0, STAND, 0), easeOut((f - 457) / 13));
    } else if (f < 495) {
      joints = mixJoints(pose2D(0, STAND, 0), POSE_PROUD, easeInOut((f - 470) / 25));
    } else {
      // Slow vain nods for the rest of the video.
      const bow = 0.5 + 0.5 * Math.sin((f - 495) * 0.055);
      joints = mixJoints(POSE_PROUD, PROUD_BOW, bow);
    }
  }

  return { joints, yaw: Math.PI, headPitch: 0, sweat: 0 };
}
