import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// Anime speed streaks while the subject sprints. `speed` comes from the
// episode's speed profile, so the lines die exactly when the motion dies.
export const SpeedLines: React.FC<{ speed: number; color?: string }> = ({
  speed,
  color = "#ffe9c4",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        y: 120 + ((i * 353) % 1700),
        len: 260 + ((i * 97) % 300),
        v: 1800 + (i % 5) * 320,
        w: 1.5 + (i % 3),
        o: 0.25 + ((i * 29) % 40) / 100,
      })),
    []
  );
  const op = speed * 0.6;
  if (op <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {lines.map((l, i) => {
          const x = (((frame * l.v) / fps + i * 530) % 1900) - 500;
          return (
            <line
              key={i}
              x1={x}
              y1={l.y}
              x2={x + l.len}
              y2={l.y}
              stroke={color}
              strokeWidth={l.w}
              opacity={l.o * op}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
