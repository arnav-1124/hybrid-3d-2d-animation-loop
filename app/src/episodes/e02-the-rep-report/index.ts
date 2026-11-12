import React from "react";
import { FPS, TOTAL_FRAMES } from "./timeline";
import { TheRepReport } from "./TheRepReport";

// Episode meta — consumed by the registry in src/Root.tsx.
export const e02TheRepReport = {
  id: "e02-the-rep-report",
  component: TheRepReport,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1080,
  height: 1920,
} as const;
