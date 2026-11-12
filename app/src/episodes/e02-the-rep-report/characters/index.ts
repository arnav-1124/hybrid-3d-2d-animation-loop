import { impatient } from "./impatient";
import { motive } from "./motive";
import type { RepState } from "./types";
import { showman } from "./showman";
import { steady } from "./steady";

// Top-to-bottom order matches PANELS in ../timeline.ts.
export const panelStates = (f: number): RepState[] => [
  motive(f),
  showman(f),
  impatient(f),
  steady(f),
];
