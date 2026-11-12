// Non-uniform (Barry-Goldman) Catmull-Rom camera path — shared by every episode.
// C1-continuous across segments; respects the authored keyframe timing exactly
// (speed = knot spacing). ONE path per episode = RULE 5 (zero hard cuts).
import type { V3 } from "../types";

export interface PathKey {
  f: number;
  pos: V3;
  target: V3;
  fov: number;
}

const cr1 = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t0: number,
  t1: number,
  t2: number,
  t3: number,
  s: number
): number => {
  const A1 = p0 + ((p1 - p0) * (s - t0)) / (t1 - t0);
  const A2 = p1 + ((p2 - p1) * (s - t1)) / (t2 - t1);
  const A3 = p2 + ((p3 - p2) * (s - t2)) / (t3 - t2);
  const B1 = A1 + ((A2 - A1) * (s - t1)) / (t2 - t1);
  const B2 = A2 + ((A3 - A2) * (s - t2)) / (t3 - t2);
  return B1 + ((B2 - B1) * (s - t1)) / (t2 - t1);
};

// Sample the path at frame f. Clamps outside the keyframe range (holds ends).
export function samplePath(
  keys: PathKey[],
  f: number
): { pos: V3; target: V3; fov: number } {
  const edgeIndex = (i: number): number => Math.min(Math.max(i, 0), keys.length - 1);

  const channel = (get: (k: PathKey) => number, i: number, s: number): number => {
    const a = keys[edgeIndex(i - 1)];
    const b = keys[edgeIndex(i)];
    const c = keys[edgeIndex(i + 1)];
    const d = keys[edgeIndex(i + 2)];
    const t1 = b.f;
    const t2 = c.f;
    // Phantom endpoints at the spline edges: virtual knots extrapolated in time
    // so the first/last segments evaluate without division by zero.
    const t0 = i - 1 < 0 ? t1 - (t2 - t1) : a.f;
    const t3 = i + 2 > keys.length - 1 ? t2 + (t2 - t1) : d.f;
    return cr1(get(a), get(b), get(c), get(d), t0, t1, t2, t3, s);
  };

  let i = 0;
  while (i < keys.length - 2 && f >= keys[i + 1].f) i++;
  const s = Math.min(Math.max(f, keys[0].f), keys[keys.length - 1].f);

  return {
    pos: [
      channel((k) => k.pos[0], i, s),
      channel((k) => k.pos[1], i, s),
      channel((k) => k.pos[2], i, s),
    ],
    target: [
      channel((k) => k.target[0], i, s),
      channel((k) => k.target[1], i, s),
      channel((k) => k.target[2], i, s),
    ],
    fov: channel((k) => k.fov, i, s),
  };
}
