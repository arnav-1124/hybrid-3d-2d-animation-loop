import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BG, BRAND, FONT, INK, MUTED } from "../../shared/palette";

// Placeholder episode — copy this folder to app/src/episodes/eNN-slug, rename the
// ids/exports, then build the real thing (see README.md in this folder).

const TEMPLATE_DURATION = 300;

const TemplateCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 10, TEMPLATE_DURATION - 10, TEMPLATE_DURATION],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 64,
          color: INK,
          letterSpacing: "0.2em",
          opacity,
        }}
      >
        {BRAND}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 96,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 28,
          color: MUTED,
          letterSpacing: "0.3em",
        }}
      >
        NEW EPISODE — REPLACE ME
      </div>
    </AbsoluteFill>
  );
};

export const eNNTemplate = {
  id: "eNN-slug",
  component: TemplateCard,
  durationInFrames: TEMPLATE_DURATION,
  fps: 30,
  width: 1080,
  height: 1920,
} as const;
