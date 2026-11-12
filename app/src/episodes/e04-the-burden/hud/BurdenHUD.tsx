import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CRIMSON_ACCENT, TEXT_HERO, TEXT_PREMISE, TEXT_SPEECH } from "../palette";
import { BEATS } from "../timeline";
import { BrandMark } from "../../../shared/overlays/BrandMark";

export const BurdenHUD: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 1. TOP NARRATIVE HOOK BANNER (0 - 85) */}
      {frame >= 5 && frame < 85 && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [5, 18, 70, 85], [0, 1, 1, 0]),
          }}
        >
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 38,
              fontWeight: 600,
              color: TEXT_PREMISE,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Two People Started The Walk.
          </div>
        </div>
      )}

      {/* 2. CONTRAST BANNER (90 - 175) */}
      {frame >= 90 && frame < 175 && (
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [90, 105, 160, 175], [0, 1, 1, 0]),
          }}
        >
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 34,
              fontWeight: 600,
              color: TEXT_PREMISE,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            One Dropped His Load To Run Fast.
          </div>
        </div>
      )}

      {/* 3. SPEECH POP-UP: Traveler 1 mocks (100 - 150) */}
      {frame >= 100 && frame < 150 && (
        <div
          style={{
            position: "absolute",
            top: 380,
            left: 540,
            opacity: interpolate(frame, [100, 110, 140, 150], [0, 1, 1, 0]),
            background: "rgba(15, 23, 42, 0.88)",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            padding: "10px 22px",
            borderRadius: 18,
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 26,
              fontWeight: 600,
              color: TEXT_SPEECH,
              letterSpacing: "0.02em",
            }}
          >
            "Why are you still carrying that?"
          </div>
        </div>
      )}

      {/* 4. THE ROAD ENDS (185 - 235) */}
      {frame >= 185 && frame < 235 && (
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [185, 195, 225, 235], [0, 1, 1, 0]),
          }}
        >
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 54,
              fontWeight: 800,
              color: CRIMSON_ACCENT,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            THE ROAD ENDED.
          </div>
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 28,
              fontWeight: 500,
              color: TEXT_PREMISE,
              marginTop: 10,
              letterSpacing: "0.05em",
            }}
          >
            There was a huge drop ahead.
          </div>
        </div>
      )}

      {/* 5. SLAM IMPACT BEAT (342 - 370) */}
      {frame >= 342 && frame < 370 && (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: interpolate(frame, [342, 347, 360, 370], [0, 1, 1, 0]),
          }}
        >
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 48,
              fontWeight: 800,
              color: "#fbbf24",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 0 24px rgba(251, 191, 36, 0.8)",
            }}
          >
            IT FIT PERFECTLY.
          </div>
        </div>
      )}

      {/* 6. HERO FINALE CARD (375 - 450, HOLDS TO THE LAST FRAME) */}
      {frame >= 375 && (
        <div
          style={{
            position: "absolute",
            bottom: 300,
            left: 50,
            right: 50,
            textAlign: "center",
            opacity: interpolate(frame, [375, 395], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 40,
              fontWeight: 600,
              color: "#cbd5e1",
              letterSpacing: "0.04em",
              marginBottom: 8,
            }}
          >
            The weight you refuse to drop today...
          </div>
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 74,
              fontWeight: 800,
              color: CRIMSON_ACCENT,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textShadow: "0 0 35px rgba(244, 63, 94, 0.7)",
              lineHeight: 1.15,
            }}
          >
            BECOMES YOUR BRIDGE
          </div>
          <div
            style={{
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 34,
              fontWeight: 500,
              color: "#f8fafc",
              letterSpacing: "0.06em",
              marginTop: 10,
            }}
          >
            to where you want to go.
          </div>
        </div>
      )}

      {/* 7. REALITY LOOP BRAND MARK */}
      <BrandMark />
    </AbsoluteFill>
  );
};
