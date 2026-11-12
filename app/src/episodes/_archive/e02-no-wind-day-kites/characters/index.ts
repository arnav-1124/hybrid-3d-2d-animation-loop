import { impatient } from "./impatient";
import { motive } from "./motive";
import type { LaneState } from "./types";
import { showman } from "./showman";
import { steady } from "./steady";

// Left-to-right order matches LANES in ../timeline.ts.
export const laneStates = (f: number): LaneState[] => [
  motive(f),
  showman(f),
  impatient(f),
  steady(f),
];
