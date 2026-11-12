import React from "react";
import { FPS, TOTAL_FRAMES } from "./timeline";
import { TheBurden } from "./TheBurden";

// Episode meta — consumed by the registry in src/Root.tsx.
export const e04TheBurden = {
  id: "e04-the-burden",
  component: TheBurden,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1080,
  height: 1920,
} as const;
