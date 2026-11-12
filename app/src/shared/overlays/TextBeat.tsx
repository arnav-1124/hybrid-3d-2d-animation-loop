import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, INK } from "../palette";

// One text beat on the 1080x1920 canvas.
// Rule 6 compliance lives at the CALL SITE: the story-crucial line gets the
// biggest `size`, slam + glow; quiet lines get `dim`. Weight stays <= 600.
export interface TextBeatProps {
  from: number;
  to: number;
  y: number; // px from top
  size: number;
  color?: string;
  weight?: number; // keep <= 600
  slam?: boolean; // punch-in entry (hero beats)
  rise?: boolean; // travel: starts BELOW the frame, slides up into place
  glow?: boolean; // warm halo (hero beats)
  dim?: boolean; // quieter presence (context lines)
  children: React.ReactNode;
}

export const TextBeat: React.FC<TextBeatProps> = ({
  from,
  to,
  y,
  size,
  color = INK,
  weight = 600,
  slam = false,
  rise = false,
  glow = false,
  dim = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const s = slam
    ? spring({ frame: frame - from, fps, config: { damping: 14, mass: 0.8 } })
    : spring({ frame: frame - from, fps, config: { damping: 180, mass: 0.7 } });
  const peak = dim ? 0.82 : 1;
  const opacity = interpolate(frame, [from, from + 8, to - 10, to], [0, peak, peak, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Rise travel: the beat starts one screen BELOW its resting slot and slides
  // up into it, motion-blurred while it moves. Used for the closing message,
  // which must arrive fully inside the frame instead of parking off the edge.
  const travel = spring({ frame: frame - from, fps, config: { damping: 20, mass: 1, stiffness: 110 } });
  const riseOffset = rise ? (1 - travel) * (height - y + 220) : 0;
  const blur = rise
    ? interpolate(travel, [0, 1], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [from, from + 10], [10, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const scale = slam ? 1.28 - 0.28 * s : 0.92 + 0.08 * s;
  const shadow = glow
    ? "0 0 28px rgba(255,179,71,0.55), 0 0 90px rgba(255,179,71,0.35), 0 6px 46px rgba(0,0,0,0.85)"
    : "0 4px 40px rgba(0,0,0,0.8)";

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          marginTop: y,
          opacity,
          transform: `translateY(${riseOffset}px) scale(${scale})`,
          filter: `blur(${blur}px)`,
          fontFamily: FONT,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.14,
          letterSpacing: "0.02em",
          color,
          textAlign: "center",
          textShadow: shadow,
          maxWidth: "88%",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
