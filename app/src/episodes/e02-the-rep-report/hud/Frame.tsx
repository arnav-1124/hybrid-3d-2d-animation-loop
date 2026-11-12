// The static frame (RULE 5): thin dividers between the four panels plus the
// brand chip. The title strip and footer are just empty void — the borders
// never move, only the characters do.
import React from "react";
import { FONT, MUTED } from "../../../shared/palette";
import { FOOTER_TOP, panelTop } from "../timeline";

const DIVIDERS = [panelTop(0), panelTop(1), panelTop(2), panelTop(3), FOOTER_TOP];

export const Frame: React.FC = () => (
  <>
    {DIVIDERS.map((y) => (
      <div
        key={y}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - 1,
          height: 2,
          background: "rgba(255,255,255,0.10)",
          pointerEvents: "none",
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        top: 26,
        left: 44,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 20,
        letterSpacing: "0.34em",
        color: MUTED,
        opacity: 0.72,
        pointerEvents: "none",
      }}
    >
      REALITY LOOP
    </div>
  </>
);
