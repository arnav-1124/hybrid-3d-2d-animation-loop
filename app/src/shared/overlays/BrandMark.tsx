import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, FONT, MUTED } from "../palette";

// Persistent brand mark — every frame, like the references do it.
export const BrandMark: React.FC = () => (
  <AbsoluteFill
    style={{
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: 96,
      pointerEvents: "none",
    }}
  >
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: "0.4em",
        color: MUTED,
        opacity: 0.55,
      }}
    >
      {BRAND}
    </div>
  </AbsoluteFill>
);
