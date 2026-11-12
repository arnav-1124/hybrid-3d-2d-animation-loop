// IMPATIENT — keeps throwing his kite straight up into windless air. Same
// input, same result, every time; he just does it louder.
import { SIT_POSE, STAND, THROW_POSE, mixJoints, pose2D } from "../../../shared/stickman/pose";
import type { V3 } from "../../../shared/types";
import { T, THROWS_AT } from "../timeline";
import { clamp01, easeInOut, mix, mixV3, type LaneState } from "./types";

const X = 1.4;
const GROUND_Y = 0.24;
const APEX = 1.95;

export function impatient(f: number): LaneState {
  // Latest throw that has happened so far.
  let tk = -1;
  for (const t of THROWS_AT) if (t <= f) tk = t;
  const t = tk < 0 ? 999 : f - tk;

  // Kite flight: rise (0-12), fall (12-24), flop-settle (24-40).
  const kx = X + 0.55;
  let ky = GROUND_Y;
  let tilt = -1.25;
  let inFlight = false;
  if (t < 12) {
    inFlight = true;
    ky = mix(GROUND_Y, APEX, easeInOut(t / 12));
    tilt = mix(-1.25, -0.15, t / 12);
  } else if (t < 24) {
    inFlight = true;
    const u = (t - 12) / 12;
    ky = mix(APEX, GROUND_Y, Math.pow(u, 1.4));
    tilt = mix(-0.15, -1.05, u);
  } else if (t < 40) {
    const u = t - 24;
    ky = GROUND_Y + 0.09 * Math.exp(-u / 6) * Math.abs(Math.cos(u * 1.1));
    tilt = -1.05 + 0.25 * Math.exp(-u / 8) * Math.sin(u * 1.3);
  }

  // Pose: wind-up into the throw, hold while it's up, slump after the flop.
  const stand = pose2D(0.5, STAND, 0);
  const windup = tk < 0 ? 0 : easeInOut(clamp01((t + 6) / 6));
  const hold = t <= 14 ? 1 : 1 - easeInOut(clamp01((t - 14) / 12));
  const throwAmt = clamp01(windup * hold);
  let joints = mixJoints(stand, THROW_POSE, throwAmt);
  // He tracks the kite with his head while it's up, stares at the flop after.
  let headPitch = inFlight
    ? Math.max(-0.75, Math.min(0.1, -ky * 0.4))
    : mix(0.12, -0.1, throwAmt * 0.5);

  // Dropout: out of throws and out of hope — he sits and hugs his knees.
  const quitT = easeInOut(clamp01((f - T.impQuit) / 14));
  joints = mixJoints(joints, SIT_POSE, quitT);
  headPitch = mix(headPitch, 0.45, quitT);

  const anchorHand: V3 = [X - 0.14, 2.36, 0.12];
  const anchorChest: V3 = [X + 0.08, 1.5, 0.12];
  const anchor = mixV3(anchorChest, anchorHand, throwAmt);
  const sitAnchor: V3 = [X + 0.15, 0.85, 0.12];
  const finalAnchor = mixV3(anchor, sitAnchor, quitT);

  return {
    root: [X, 0, 0],
    joints,
    yaw: 0,
    headPitch,
    sweat: 0.3 * (1 - quitT),
    kite: {
      pos: [kx, ky, 0.3],
      tilt,
      sway: inFlight ? 0.35 : 0.12,
      anchor: finalAnchor,
      slack: inFlight ? 0.12 : mix(0.42, 0.7, quitT),
    },
    flash: 0,
  };
}
