// STEADY — the winner. Mounts without ceremony, reps at one even cadence the
// whole video, never stops, never reacts. His 15th crest lands EXACTLY on the
// hero line (f630); his 14th (f590) passes IMPATIENT's frozen 14.
import { mountPose, repPose, evenShape } from "./hang";
import type { RepState } from "./types";
import { T } from "../timeline";

const START = 50; // rep cycles begin (mount = T.mount.steady = 38)
const PERIOD = 40;

export function steady(f: number): RepState {
  let joints: ReturnType<typeof repPose>;

  if (f < START) {
    joints = mountPose(f, T.mount.steady);
  } else {
    const p = (((f - START) % PERIOD) + PERIOD) % PERIOD / PERIOD;
    joints = repPose(p < 0.5 ? 2 * p : 2 * (1 - p), evenShape);
  }

  return { joints, yaw: 0, headPitch: 0, sweat: 0 };
}
