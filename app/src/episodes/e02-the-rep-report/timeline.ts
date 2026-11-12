// "The Rep Report" timeline. 1080x1920 @ 30fps, 720 frames (24s — under the
// 32s cap). Type B: 4 stacked panels, ONE exercise (pull-ups), one winner.
// Every function here is a pure function of the frame index. Zero cuts
// (RULE 5): each panel's camera is one slow continuous push; the motion lives
// in the reps, counters, tags and text beats.

import { interpolate } from "remotion";
import { AMBER, CYAN, ORANGE, VIOLET } from "./palette";

export const FPS = 30;
export const TOTAL_FRAMES = 720; // 24s

// Vertical layout (px): title strip / 4 panels / footer. 90 + 4*410 + 190 = 1920.
// The strip and footer stay EMPTY of subjects for the whole episode — they are
// the only safe text zones (panels are wall-to-wall character).
export const STRIP_H = 90;
export const FOOTER_H = 190;
export const PANEL_H = 410;
export const panelTop = (i: number): number => STRIP_H + i * PANEL_H;
export const FOOTER_TOP = STRIP_H + 4 * PANEL_H; // 1730

// Panels, top to bottom. The winner is LAST so the eye lands on him at the payoff.
export const PANELS = [
  { key: "motive", name: "MOTIVATION", color: ORANGE },
  { key: "show", name: "SHOWMAN", color: VIOLET },
  { key: "imp", name: "IMPATIENT", color: CYAN },
  { key: "steady", name: "STEADY", color: AMBER },
] as const;

// Key beats (frames) — the locked arc, translated to reps:
export const T = {
  fadeInEnd: 8,
  title: [2, 170] as const, // premise readable from frame 2 (rule 7)
  mount: { motive: 18, imp: 30, steady: 38, show: 48 } as const, // jump + grab (12f)
  motiveQuit: 200, // stalls mid-pull, slides down, sits under the bar
  showQuit: 310, // quits ON the bar — grinds to the top for the pose anyway
  impQuit: 400, // the burst burns out; hangs limp, done
  steadyPass: 590, // STEADY's counter passes IMPATIENT's frozen 14
  dimStart: 622, // brightness hierarchy: losers fade, the winner stays lit
  thesis: [602, 668] as const, // strip slot — swaps to the CTA at 670
  hero: [630, 730] as const, // lands exactly on STEADY's 15th rep — biggest text
  cta: [670, 730] as const,
};

// --- Rep clocks (the story meters). One rep = pull then lower; the counter
// ticks at the CREST (chin clears the bar) — a failed rep never counts.
export const REPS = {
  motive: { start: 30, period: 34, quit: T.motiveQuit },
  show: { start: 60, period: 80, quit: T.showQuit },
  imp: { start: 42, period: 26, quit: T.impQuit },
  steady: { start: 50, period: 40, quit: Number.POSITIVE_INFINITY },
} as const;

// Completed reps at frame f: ticks as he crests, frozen from `quit`.
export const repCount = (
  r: { start: number; period: number; quit: number },
  f: number
): number => {
  const t = Math.min(f, r.quit) - r.start;
  return t < 0 ? 0 : Math.floor(t / r.period + 0.5);
};

// Brightness hierarchy (v7): losers dim to near-black, the winner stays lit.
// Applied per panel to the 3D scene (bar + stickman) and its HUD modules.
export const loserDim = (f: number): number =>
  interpolate(f, [T.dimStart, T.dimStart + 58], [1, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Loser HUD text fades a beat faster than the 3D dim so the thesis/hero line
// never fights a module for the same pixels (the e02-v1 collision lesson).
export const hudDim = (f: number): number =>
  interpolate(f, [T.dimStart, T.dimStart + 28], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
