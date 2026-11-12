// SHOWMAN — performs for an audience that isn't there. His kite is tied to a
// pole for the shot; he never actually tries to fly it.
import { POSE_PROUD, SIT_POSE, STAND, mixJoints, pose2D } from "../../../shared/stickman/pose";
import type { V3 } from "../../../shared/types";
import { strikeAt, strikeIndex, T } from "../timeline";
import { clamp01, easeInOut, mix, mixV3, type LaneState } from "./types";

const X = -1.4;

export function showman(f: number): LaneState {
  const idx = strikeIndex(f);
  const at = strikeAt(idx);
  // Each strike pops into place over 8 frames, holds, then relaxes a touch.
  const sT = easeInOut(clamp01((f - at) / 8));
  const relax = idx > 0 ? easeInOut(clamp01((f - (at + 8)) / 17)) * 0.18 : 0;
  const proud = mixJoints(pose2D(0.3, STAND, 0), POSE_PROUD, sT * (1 - relax));
  const baseHead = idx % 2 === 0 ? 0.12 : -0.08;
  let headPitch = baseHead * sT;

  // Dropout: he sits down at the pole's base. The kite stays posed.
  const sitT = easeInOut(clamp01((f - T.showSit) / 14));
  const root: V3 = mixV3([X, 0, 0], [X + 0.5, 0, 0.14], sitT);
  const joints = mixJoints(proud, SIT_POSE, sitT);
  headPitch = mix(headPitch, 0.42, sitT);

  // Camera-flash pulse shortly after each strike — the photo he came for.
  const ft = f - (at + 5);
  const flash = sitT > 0 ? 0 : ft >= 0 && ft <= 8 ? 1 - Math.abs(ft / 4 - 1) : 0;

  return {
    root,
    joints,
    yaw: 0,
    headPitch,
    sweat: 0,
    kite: {
      pos: [X + 1.29, 1.14, 0.3],
      tilt: 0.5,
      sway: 0.1,
      anchor: [X + 0.95, 2.05, 0.3],
      slack: 0.06,
    },
    flash,
  };
}
