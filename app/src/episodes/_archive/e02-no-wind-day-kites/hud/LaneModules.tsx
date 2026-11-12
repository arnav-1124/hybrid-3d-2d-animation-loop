// Per-lane HUD (v7 brain): label + live counter + status tag + pop-ups,
// anchored to each character via world->screen projection so everything
// tracks the continuous camera. Losers' modules dim with the 3D world.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { apparentScale, worldToScreen } from "../../../shared/projection";
import { FONT, INK, MUTED } from "../../../shared/palette";
import type { CamState } from "../../../shared/types";
import { clamp01, easeInOut, mix, type LaneState } from "../characters/types";
import { AMBER } from "../palette";
import { LANES, loserDim, meters, steps, strikeIndex, T, throwsSoFar } from "../timeline";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const UNITS = ["M", "POSES", "THROWS", "STEPS"];
const VALUES = [meters, strikeIndex, throwsSoFar, steps];
const DONE_AT = [T.mStop, T.showSit, T.impQuit, Number.POSITIVE_INFINITY];

const POPUPS: Array<{ from: number; to: number; lane: number; text: string }> = [
  { from: 30, to: 84, lane: 0, text: "watch this." },
  { from: 150, to: 204, lane: 1, text: "perfect light." },
  { from: 243, to: 297, lane: 2, text: "maybe higher?" },
  { from: 470, to: 524, lane: 2, text: "still nothing…" },
  { from: 600, to: 654, lane: 3, text: "huh." },
];

const TAGS: Array<{ from: number; lane: number; text: string; color?: string }> = [
  { from: T.mStop, lane: 0, text: "GAVE UP" },
  { from: T.showSit, lane: 1, text: "FOR SHOW" },
  { from: T.impQuit, lane: 2, text: "HOPING" },
  { from: T.lift, lane: 3, text: "LIFTED", color: AMBER },
];

export const LaneModules: React.FC<{ cam: CamState; states: LaneState[] }> = ({ cam, states }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  // STEADY's module rides up with his kite at the lift; the rest hold position.
  const liftT = easeInOut(clamp01((frame - T.lift) / 44));

  return (
    <>
      {LANES.map((lane, i) => {
        const anchorY = lane.key === "steady" ? mix(2.62, 4.35, liftT) : 2.62;
        const s = worldToScreen([lane.x, anchorY, 0], cam, width, height);
        if (!s.visible) return null;
        const dim = lane.key === "steady" ? 1 : loserDim(frame);
        const sc = apparentScale(s.depth);
        const value = VALUES[i](frame);
        const done = frame >= DONE_AT[i];
        const tag = TAGS.find((t) => t.lane === i && frame >= t.from);
        const popup = POPUPS.find((p) => p.lane === i && frame >= p.from && frame <= p.to);
        const popOp = popup
          ? interpolate(frame, [popup.from, popup.from + 8, popup.to - 8, popup.to], [0, 1, 1, 0], CLAMP)
          : 0;
        const tagOp = tag
          ? interpolate(frame, [tag.from, tag.from + 8], [0, 1], CLAMP)
          : 0;

        return (
          <AbsoluteFill key={lane.key} style={{ pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                left: s.x,
                top: s.y,
                transform: `translate(-50%, -100%) scale(${sc})`,
                transformOrigin: "bottom center",
                opacity: dim,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {popup && (
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: 25,
                    color: lane.color,
                    background: "rgba(7,7,11,0.78)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: "4px 14px",
                    opacity: popOp,
                  }}
                >
                  {popup.text}
                </div>
              )}
              {tag && (
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: 24,
                    letterSpacing: "0.12em",
                    color: tag.color ?? lane.color,
                    border: `1px solid ${tag.color ?? lane.color}`,
                    background: "rgba(7,7,11,0.72)",
                    borderRadius: 10,
                    padding: "5px 14px",
                    opacity: tagOp,
                  }}
                >
                  {tag.text}
                </div>
              )}
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 44,
                  color: done ? MUTED : INK,
                  textAlign: "center",
                }}
              >
                {value}
                <span
                  style={{
                    fontSize: 21,
                    color: MUTED,
                    marginLeft: 6,
                    letterSpacing: "0.08em",
                  }}
                >
                  {UNITS[i]}
                </span>
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 26,
                  color: lane.color,
                  letterSpacing: "0.14em",
                  textAlign: "center",
                }}
              >
                {lane.name}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </>
  );
};
