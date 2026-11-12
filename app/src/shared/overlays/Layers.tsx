import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Payoff dim: darkens the world for the flip (opacity driven by the episode's moodDim()).
export const MoodDim: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ backgroundColor: "#05050a", opacity, pointerEvents: "none" }} />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

// Fade from black at the start, to black at the end.
// Pass fadeOutStart >= totalFrames (or omit it) to HOLD the last frames with
// no fade-out (v7 mechanic) — the fade-in curve is still applied.
export const FadeLayer: React.FC<{
  fadeInEnd: number;
  fadeOutStart?: number;
  totalFrames: number;
}> = ({ fadeInEnd, fadeOutStart = Number.POSITIVE_INFINITY, totalFrames }) => {
  const frame = useCurrentFrame();
  const opacity =
    fadeOutStart >= totalFrames
      ? interpolate(frame, [0, fadeInEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, fadeInEnd, fadeOutStart, totalFrames], [1, 0, 0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity, pointerEvents: "none" }} />;
};
