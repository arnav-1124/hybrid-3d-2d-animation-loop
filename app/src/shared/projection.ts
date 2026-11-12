// World -> screen projection for HUD anchored to 3D subjects.
// Pure math (no three.js): builds the same look-at basis CameraRig uses, then a
// manual perspective divide. Also returns an apparent-size factor so HUD can
// scale with distance. This is also the hook for future QA text-safe-zone checks.
import type { CamState, V3 } from "./types";

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

export interface ScreenAnchor {
  x: number; // px from left
  y: number; // px from top
  depth: number; // world units along the view axis
  visible: boolean; // in front of the camera
}

export function worldToScreen(
  p: V3,
  cam: CamState,
  width: number,
  height: number
): ScreenAnchor {
  const fwd = norm(sub(cam.target, cam.pos));
  const right = norm(cross(fwd, [0, 1, 0]));
  const up = cross(right, fwd);
  const d = sub(p, cam.pos);
  const depth = dot(d, fwd);
  const tanV = Math.tan(((cam.fov / 2) * Math.PI) / 180);
  const tanH = tanV * (width / height);
  const x = (dot(d, right) / (depth * tanH)) * 0.5 + 0.5;
  const y = 0.5 - (dot(d, up) / (depth * tanV)) * 0.5;
  return { x: x * width, y: y * height, depth, visible: depth > 0.1 };
}

// Apparent-scale factor for HUD: 1 at the reference (wide-shot) depth,
// growing on push-ins, clamped so labels stay legible but never balloon.
export const apparentScale = (depth: number, refDepth = 21): number =>
  Math.max(0.8, Math.min(1.55, refDepth / Math.max(depth, 1)));
