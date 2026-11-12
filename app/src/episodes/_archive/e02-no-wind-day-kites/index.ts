import React from "react";
import { FPS, TOTAL_FRAMES } from "./timeline";
import { NoWindDay } from "./NoWindDay";

// Episode meta — consumed by the registry in src/Root.tsx.
export const e02NoWindDay = {
  id: "e02-no-wind-day",
  component: NoWindDay,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1080,
  height: 1920,
} as const;
