// IMPATIENT — bursts out reps with a kip (fast pull, fast drop), out-reps
// EVERYONE early, then burns out mid-rep at 400: sags, dead-drops, and hangs
// limp for the rest of the video. His frozen 14 gets passed at f590.
import { HANG_BOTTOM, DEAD_HANG, mountPose, repPose } from "./hang";
import { mixJoints, type Joints } from "../../../shared/stickman/pose";
import type { RepState } from "./types";
import { clamp01, easeIn, easeInOut, easeOut, mix } from "./types";
import { T } from "../timeline";

const START = 42; // rep cycles begin (mount = T.mount.imp = 30)
const PERIOD = 26;
const QUIT = T.impQuit; // 400 — mid pull 15

// Kip shape: explosive pull (first half), drop back (second half). Exactly 1
// at the crest so the counter ticks as the chin clears the bar.
const kipShape = (u: number): number =>
  u < 0.5 ? easeOut(2 * u) : 1 - easeInOut(2 * (u - 0.5));
const cycleT = (f: number): number => {
  const p = (((f - START) % PERIOD) + PERIOD) % PERIOD / PERIOD;
  return kipShape(p);
};
// Where he arrests when he quits (p at f=399).
const QUIT_T = kipShape((((QUIT - 1 - START) % PERIOD) + PERIOD) % PERIOD / PERIOD);

export function impatient(f: number): RepState {
  let joints: Joints;

  if (f < START) {
    joints = mountPose(f, T.mount.imp);
  } else if (f < QUIT) {
    joints = repPose(cycleT(f), kipShape);
  } else {
    // Burnout: sag with a strain tremble, then dead-drop, then limp panting.
    if (f < 418) {
      const sag = mix(QUIT_T, 0.32, easeOut((f - QUIT) / 18));
      joints = repPose(sag + 0.012 * Math.sin((f - QUIT) * 0.8), kipShape);
    } else if (f < 432) {
      joints = repPose(0.32 * (1 - easeIn((f - 418) / 14)), kipShape);
    } else if (f < 448) {
      joints = mixJoints(HANG_BOTTOM, DEAD_HANG, easeInOut((f - 432) / 16));
    } else {
      // Faint breathing sway, forever: the burst spent everything.
      const breathe = 0.06 + 0.05 * Math.sin((f - 448) * 0.09);
      joints = mixJoints(DEAD_HANG, HANG_BOTTOM, clamp01(breathe));
    }
  }

  // Sweat: light at the start of the show-off burst, drenched at burnout.
  const sweat =
    f < 150 ? mix(0, 0.35, f / 150) : f < 400 ? mix(0.35, 1.0, (f - 150) / 250) : 1.0;

  return { joints, yaw: 0, headPitch: 0, sweat };
}
