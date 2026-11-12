// "No Wind Day" timeline. 1080x1920 @ 30fps, 720 frames (24s — roomy like the
// v6 matrix, under the 32s cap). Type B: 4 lanes, one virtue, one winner.
// Every function here is a pure function of the frame index.
// Camera lives in ./camera.ts (one continuous path — RULE 5).

import { interpolate } from "remotion";
import { AMBER, CYAN, ORANGE, VIOLET } from "./palette";

export const FPS = 30;
export const TOTAL_FRAMES = 720; // 24s

// Lanes, left to right. The winner is LAST so the eye travels to him at the payoff.
export const LANES = [
  { key: "motive", name: "MOTIVATION", x: -4.2, color: ORANGE },
  { key: "show", name: "SHOWMAN", x: -1.4, color: VIOLET },
  { key: "imp", name: "IMPATIENT", x: 1.4, color: CYAN },
  { key: "steady", name: "STEADY", x: 4.2, color: AMBER },
];

// Key beats (frames). Something changes every ~1-2.5s somewhere (rule 8):
// counters tick constantly, throws/pose-strikes are scheduled, crises are spaced.
export const T = {
  fadeInEnd: 8,
  header: [2, 170] as const, // premise readable from frame 2 (rule 7)
  steadyWalkStart: 24,
  mStop: 200, // MOTIVATION hits empty
  showSit: 310, // SHOWMAN gives up on wind, keeps the photo
  impQuit: 400, // IMPATIENT runs out of throws
  lift: 560, // STEADY's kite catches "wind"
  glance: 585, // his single look back
  dimStart: 622, // brightness hierarchy: losers fade, winner stays lit
  thesis: [602, 730] as const, // hold PAST the last frame (v7 mechanic: no fade-out)
  hero: [630, 730] as const, // HERO line — biggest text on screen
  cta: [670, 730] as const,
};

// IMPATIENT's throw schedule: every ~1.3s, and the kite flops back every time.
export const THROWS_AT = [55, 95, 135, 175, 215, 255, 295, 335, 375];
export const throwsSoFar = (f: number): number => THROWS_AT.filter((t) => t <= f).length;

// SHOWMAN's pose strikes (counter + flash + pose swap all key off this).
export const strikeIndex = (f: number): number =>
  f < 40 ? 0 : Math.min(11, Math.floor((f - 40) / 25));
export const strikeAt = (idx: number): number => 40 + idx * 25;

// Counters — the story clock (v7 mechanic). Numbers instead of narration.
export const meters = (f: number): number =>
  f < T.mStop ? Math.round((f - 6) * 1.1) : 213;
export const steps = (f: number): number =>
  Math.floor((Math.max(0, f - T.steadyWalkStart) * 5.4) / 30 / Math.PI);

// Brightness hierarchy (v7): losers dim to near-black, the winner stays lit.
// Applied per lane to stickman, kite, props and HUD modules.
export const loserDim = (f: number): number =>
  interpolate(f, [T.dimStart, T.dimStart + 58], [1, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
