// STEADY — the winner. Walks the whole video, every step the same, no audience.
// His kite lifts not because he found wind, but because he made some.
import { pose2D, WALK } from "../../../shared/stickman/pose";
import type { V3 } from "../../../shared/types";
import { T } from "../timeline";
import { clamp01, easeInOut, mix, patrolYaw, tri, type LaneState } from "./types";

const X0 = 3.55; // patrol left edge
const SPAN = 1.3;
const PERIOD = 200; // 100 frames each way — unhurried
const KITE_SPOT: V3 = [3.35, 0.2, 0.34];

export function steady(f: number): LaneState {
  const w = Math.max(0, f - T.steadyWalkStart);
  const x = X0 + tri(w, PERIOD) * SPAN;
  const yaw = patrolYaw(w, PERIOD);
  const joints = pose2D((w / 30) * 5.4, WALK, 0);

  // One glance back at the lift — his only reaction. Then he keeps walking.
  const g = f - T.glance;
  const glanceEnv = g >= 0 && g <= 16 ? Math.sin((Math.PI * g) / 16) : 0;
  const headPitch = -0.5 * glanceEnv;

  // The lift: the kite rises off its spot and stays up, bobbing.
  const liftT = easeInOut(clamp01((f - T.lift) / 44));
  const bob = liftT >= 1 ? Math.sin((f - T.lift - 44) * 0.09) * 0.13 : 0;
  const kx = mix(KITE_SPOT[0], KITE_SPOT[0] + 0.25, liftT);
  const ky = mix(KITE_SPOT[1], 3.05, liftT) + bob;
  // String sag follows his patrol distance — visible tension as he walks away.
  const dist = Math.abs(x - KITE_SPOT[0]);
  const slack = mix(0.45 - 0.22 * dist, 0.05, liftT);

  return {
    root: [x, 0, 0],
    joints,
    yaw,
    headPitch,
    sweat: 0,
    kite: {
      pos: [kx, ky, KITE_SPOT[2]],
      tilt: mix(-1.25, -0.32, liftT),
      sway: mix(0.12, 0.85, liftT),
      anchor: [x + 0.12, mix(1.42, 1.58, liftT), 0.12],
      slack,
    },
    flash: 0,
  };
}
