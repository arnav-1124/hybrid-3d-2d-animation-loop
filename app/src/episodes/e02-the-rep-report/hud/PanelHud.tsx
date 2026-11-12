// Per-panel HUD (v7 brain): name + live REPS counter + verdict tag + pop-ups.
// Fixed screen anchors per band — no projection needed (the panel cameras are
// near-static). Losers' modules dim with the 3D world; STEADY's stays lit.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT, INK, MUTED } from "../../../shared/palette";
import { AMBER } from "../palette";
import { hudDim, loserDim, PANELS, PANEL_H, panelTop, repCount, REPS, T } from "../timeline";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Facing direction on screen (+1 right / -1 left) — pop-ups sit beside the face.
const FACING = [1, -1, 1, 1];

const POPUPS: Array<{ from: number; to: number; panel: number; text: string }> = [
  { from: 44, to: 98, panel: 0, text: "light weight." },
  { from: 120, to: 174, panel: 1, text: "check the form." },
  { from: 100, to: 154, panel: 2, text: "warming up." },
  { from: 470, to: 524, panel: 2, text: "arms gone." },
  { from: 600, to: 654, panel: 3, text: "still fresh." },
];

const TAGS: Array<{ from: number; panel: number; text: string; color?: string }> = [
  { from: T.motiveQuit, panel: 0, text: "GAVE UP" },
  { from: T.showQuit, panel: 1, text: "FOR SHOW" },
  { from: T.impQuit, panel: 2, text: "BURNT OUT" },
  { from: T.steadyPass, panel: 3, text: "STILL GOING", color: AMBER },
];

const QUIT_AT = [T.motiveQuit, T.showQuit, T.impQuit, Number.POSITIVE_INFINITY];

export const PanelHud: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {PANELS.map((panel, i) => {
        const top = panelTop(i);
        const isSteady = panel.key === "steady";
        const hudOp = isSteady ? 1 : hudDim(frame);
        const value = repCount(REPS[panel.key as keyof typeof REPS], frame);
        const done = frame >= QUIT_AT[i];
        const tag = TAGS.find((t) => t.panel === i && frame >= t.from);
        const popup = POPUPS.find((p) => p.panel === i && frame >= p.from && frame <= p.to);
        const popOp = popup
          ? interpolate(frame, [popup.from, popup.from + 8, popup.to - 8, popup.to], [0, 1, 1, 0], CLAMP)
          : 0;
        const tagOp = tag ? interpolate(frame, [tag.from, tag.from + 8], [0, 1], CLAMP) : 0;

        return (
          <AbsoluteFill key={panel.key} style={{ pointerEvents: "none" }}>
            {/* name */}
            <div
              style={{
                position: "absolute",
                left: 64,
                top: top + 24,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 32,
                letterSpacing: "0.14em",
                color: panel.color,
                textShadow: "0 2px 24px rgba(0,0,0,0.9)",
                opacity: hudOp,
              }}
            >
              {panel.name}
            </div>
            {/* counter */}
            <div
              style={{
                position: "absolute",
                right: 64,
                top: top + 12,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                fontFamily: FONT,
                fontWeight: 600,
                opacity: hudOp,
              }}
            >
              <span style={{ fontSize: 50, color: done ? MUTED : INK }}>{value}</span>
              <span style={{ fontSize: 16, color: MUTED, letterSpacing: "0.12em" }}>REPS</span>
            </div>
            {/* speech popup, beside the face */}
            {popup && (
              <div
                style={{
                  position: "absolute",
                  left: 540 + FACING[i] * 240,
                  top: top + 150,
                  transform: "translateX(-50%)",
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 28,
                  color: panel.color,
                  background: "rgba(7,7,11,0.82)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 12,
                  padding: "5px 16px",
                  opacity: popOp,
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 18px rgba(0,0,0,0.9)",
                }}
              >
                {popup.text}
              </div>
            )}
            {/* verdict tag, bottom-left of the band */}
            {tag && (
              <div
                style={{
                  position: "absolute",
                  left: 64,
                  top: top + PANEL_H - 84,
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 32,
                  letterSpacing: "0.12em",
                  color: tag.color ?? panel.color,
                  border: `1px solid ${tag.color ?? panel.color}`,
                  background: "rgba(7,7,11,0.84)",
                  borderRadius: 10,
                  padding: "7px 18px",
                  opacity: tagOp * hudOp,
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                }}
              >
                {tag.text}
              </div>
            )}
          </AbsoluteFill>
        );
      })}
    </>
  );
};
