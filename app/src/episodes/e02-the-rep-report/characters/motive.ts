// MOTIVATION — talks big, burns bright, quits first. Five real reps, then the
// sixth pull dies halfway, he slides off and sits under the bar, done.
import {
  HANG_BOTTOM,
  FALLING,
  DEAD_HANG,
  mountPose,
  repPose,
  evenShape,
} from "./hang";
import { pose2D, STAND, SIT_POSE, mixJoints } from "../../../shared/stickman/pose";
import type { RepState } from "./types";
import { easeInOut, easeOut, mix } from "./types";
import { T } from "../timeline";

const START = 30; // rep cycles begin (mount = T.mount.motive = 18)
const PERIOD = 34;
const QUIT = T.motiveQuit; // 200 — lands exactly on a cycle bottom (p = 0)

export function motive(f: number): RepState {
  let joints: ReturnType<typeof pose2D>;

  if (f < START) {
    joints = mountPose(f, T.mount.motive);
  } else if (f < QUIT) {
    const p = ((f - START) % PERIOD) / PERIOD;
    joints = repPose(p < 0.5 ? 2 * p : 2 * (1 - p), evenShape);
  } else {
    // The sixth rep dies: pull to ~35%, stall with a tremble, slide down.
    if (f < 214) {
      joints = repPose(0.35 * easeOut((f - QUIT) / 14), evenShape);
    } else if (f < 258) {
      const tremble = 0.02 * Math.sin((f - 214) * 0.55);
      joints = repPose(0.35 + tremble, evenShape);
    } else if (f < 288) {
      joints = repPose(0.35 * (1 - easeInOut((f - 258) / 30)), evenShape);
    } else if (f < 300) {
      joints = mixJoints(HANG_BOTTOM, DEAD_HANG, easeInOut((f - 288) / 12));
    } else if (f < 312) {
      joints = mixJoints(DEAD_HANG, FALLING, easeInOut((f - 300) / 12));
    } else if (f < 326) {
      joints = mixJoints(FALLING, pose2D(0, STAND, 0), easeOut((f - 312) / 14));
    } else if (f < 356) {
      joints = mixJoints(pose2D(0, STAND, 0), SIT_POSE, easeInOut((f - 326) / 30));
    } else {
      joints = SIT_POSE;
    }
  }

  // Sweat: breaks during the failed stall, dries slowly on the floor.
  const sweat =
    f < 214 ? 0 : f < 258 ? mix(0, 0.55, easeOut((f - 214) / 44)) : f < 500 ? mix(0.55, 0.4, (f - 258) / 242) : 0.4;

  return { joints, yaw: 0, headPitch: 0, sweat };
}
