// ONE continuous camera path for the whole episode (RULE 5: zero hard cuts).
// A wide 4-lane matrix frame with slow drift, gentle continuous push-ins at
// each dropout, and a final pull-back rise for the tableau. No cuts anywhere.
import type { CamState } from "../../shared/types";
import { type PathKey, samplePath } from "../../shared/three/crPath";

// Keyframe plan (shot idea -> what it sells):
const KEYS: PathKey[] = [
  // f    pos                target              fov
  { f: 0, pos: [-0.8, 3.2, 21.5], target: [0, 1.8, 0], fov: 47 }, // K0 wide, slight left bias
  { f: 150, pos: [0.7, 3.25, 21.2], target: [0, 1.78, 0], fov: 47 }, // K1 slow drift right
  { f: 215, pos: [-2.4, 3.0, 17.0], target: [-3.1, 1.6, 0], fov: 47 }, // K2 push-in: MOTIVATION crashes
  { f: 330, pos: [-0.6, 3.1, 19.0], target: [-0.9, 1.7, 0], fov: 47 }, // K3 half-back: SHOWMAN gives up
  { f: 420, pos: [1.2, 2.95, 17.5], target: [1.1, 1.6, 0], fov: 47 }, // K4 push-in: IMPATIENT quits
  { f: 500, pos: [0.4, 3.15, 20.0], target: [0.6, 1.75, 0], fov: 47 }, // K5 settle wide — only STEADY moves
  { f: 590, pos: [2.4, 3.3, 16.8], target: [3.0, 2.35, 0], fov: 47 }, // K6 push: the kite LIFTS
  { f: 645, pos: [1.6, 3.7, 18.5], target: [2.2, 2.5, 0], fov: 46.5 }, // K7 follow the kite, start pull-back
  { f: 720, pos: [0, 4.8, 22.0], target: [0, 2.3, 0], fov: 46 }, // K8 final wide tableau, all four visible
];

// Calm comparison frame — no handheld shake (v6's steady-matrix feel).
export function cameraState(f: number): CamState {
  const s = samplePath(KEYS, f);
  return { pos: s.pos, target: s.target, fov: s.fov };
}
