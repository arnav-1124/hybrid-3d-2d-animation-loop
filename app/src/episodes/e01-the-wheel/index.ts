import React from "react";
import { FPS, TOTAL_FRAMES } from "./timeline";
import { TheWheel } from "./TheWheel";

// Episode meta — consumed by the registry in src/Root.tsx.
export const e01TheWheel = {
  id: "e01-the-wheel",
  component: TheWheel,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1080,
  height: 1920,
} as const;
