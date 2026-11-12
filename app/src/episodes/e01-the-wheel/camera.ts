// ONE continuous camera path for the whole episode (RULE 5: zero hard cuts).
// A non-uniform Catmull-Rom spline through 11 authored keyframes (shared
// sampler in shared/three/crPath), evaluated as a pure function of the frame.
// The keyframes retell the draft's station shots (hero low -> profile close ->
// pull-out -> top 3/4 -> low wide -> tracking) welded into a single flowing
// move — no station ever teleports.
import type { CamState, V3 } from "../../shared/types";
import { type PathKey, samplePath } from "../../shared/three/crPath";
import { speedProfile } from "./timeline";

// Keyframe plan (shot idea -> what it sells):
const KEYS: PathKey[] = [
  // f    pos                 target              fov
  { f: 0, pos: [0.15, 0.9, 6.4], target: [0, 2.4, 0], fov: 58 }, // K0 LOW HERO: up through the spokes (hook)
  { f: 50, pos: [0.12, 0.95, 5.9], target: [0, 2.3, 0], fov: 57 }, // K1 end of the slow push-in
  { f: 120, pos: [0, 2.0, 7.6], target: [0, 1.78, 0], fov: 55 }, // K2 SIDE PROFILE CLOSE: crane up + settle (run cycle reads)
  { f: 160, pos: [0, 3.3, 10.8], target: [0, 2.0, 0], fov: 51 }, // K3 pull-out mid
  { f: 200, pos: [0, 5.15, 16.5], target: [0, 2.6, 0], fov: 42 }, // K4 PULL-OUT REVEAL: he is alone in a huge wheel
  { f: 262, pos: [1.35, 9.3, 8.6], target: [0.2, 2.15, 0], fov: 48 }, // K5 TOP 3/4: the void around the wheel reads (wheel dies here)
  { f: 300, pos: [0.7, 5.4, 9.8], target: [0.15, 2.2, 0], fov: 49 }, // K6 diving down
  { f: 322, pos: [0, 0.55, 10.5], target: [0, 2.2, 0], fov: 50 }, // K7 LOW WIDE: realization + hop, breathing room
  { f: 380, pos: [1.35, 1.15, 10.1], target: [3.0, 1.72, 0.5], fov: 49 }, // K8 tracking: pan follows the walk
  { f: 430, pos: [2.55, 2.1, 9.9], target: [4.5, 1.9, 0.55], fov: 47 }, // K9 near his exit
  { f: 465, pos: [3.0, 2.25, 9.8], target: [5.2, 1.95, 0.55], fov: 46.5 }, // K10 final drift — message holds alone
];

export function cameraState(f: number): CamState {
  const s = samplePath(KEYS, f);

  // Handheld micro-shake scaled by speed — additive wobble, not a cut.
  const shake = speedProfile(f);
  return {
    pos: [
      s.pos[0] + Math.sin(f * 0.9) * 0.05 * shake,
      s.pos[1] + Math.sin(f * 1.3 + 2) * 0.035 * shake,
      s.pos[2],
    ],
    target: s.target,
    fov: s.fov,
  };
}
