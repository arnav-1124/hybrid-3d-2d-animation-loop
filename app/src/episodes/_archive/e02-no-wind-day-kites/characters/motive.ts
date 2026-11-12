// MOTIVATION — sprints flat-out dragging his kite, until the tank hits empty.
// His effort is real; the mistake is spending all of it at once, into nothing.
import { BENT_POSE, mixJoints, pose2D, RUN } from "../../../shared/stickman/pose";
import type { V3 } from "../../../shared/types";
import { T } from "../timeline";
import {
  clamp01,
  easeInOut,
  mix,
  mixV3,
  patrolYaw,
  tri,
  triDir,
  type LaneState,
} from "./types";

const MIN = -4.95; // patrol left edge
const SPAN = 1.55;
const PERIOD = 66;

export function motive(f: number): LaneState {
  const running = f < T.mStop;
  const p = Math.min(f, T.mStop); // the patrol freezes at the dropout

  const x = MIN + tri(p - 6, PERIOD) * SPAN;
  const dir = triDir(p - 6, PERIOD);
  const yaw = patrolYaw(p - 6, PERIOD);

  // Sprint cycle (fast), frozen mid-stride when he stops.
  const phase = ((p - 6) / 30) * 14;
  const run = pose2D(phase, RUN, 0);
  const bentT = easeInOut(clamp01((f - T.mStop) / 14));
  const joints = mixJoints(run, BENT_POSE, bentT);
  const headPitch = 0.5 * bentT;

  // Kite: skitters along the ground behind him, then flops flat when he does.
  const flopT = easeInOut(clamp01((f - T.mStop) / 10));
  const bounce = running ? Math.abs(Math.sin(f * 0.9)) * 0.13 : 0;
  const kx = x - dir * 0.85;
  const pos: V3 = mixV3([kx, 0.22 + bounce, 0.3], [kx, 0.18, 0.3], flopT);
  const tilt = mix(-1.05 + Math.sin(f * 2.1) * 0.1, -1.28, flopT);
  const anchor: V3 = [x - dir * 0.3, 1.25 - 0.25 * bentT, 0.12];

  return {
    root: [x, 0, 0],
    joints,
    yaw,
    headPitch,
    sweat: 1 - flopT,
    kite: {
      pos,
      tilt,
      sway: mix(0.5, 0.15, flopT),
      anchor,
      slack: mix(0.34, 0.6, flopT),
    },
    flash: 0,
  };
}
