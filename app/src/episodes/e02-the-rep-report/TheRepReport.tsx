import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
// Music slot: drop a licensed track at app/public/audio/e02-the-rep-report.mp3, then uncomment:
// import { Audio, staticFile } from "remotion";

import { ThreeCanvas } from "@remotion/three";

import { panelStates } from "./characters";
import { GymPanel } from "./scene/GymPanel";
import { Beats } from "./hud/Beats";
import { Frame } from "./hud/Frame";
import { PanelHud } from "./hud/PanelHud";
import { loserDim, PANELS, PANEL_H, panelTop, T, TOTAL_FRAMES } from "./timeline";
import { BG } from "./palette";
import { CameraRig } from "../../shared/three/CameraRig";
import { FadeLayer, Vignette } from "../../shared/overlays/Layers";
import type { CamState } from "../../shared/types";

// One slow continuous push per panel — IDENTICAL for all four (same test, same
// framing, a fair comparison). No cuts anywhere (RULE 5); the motion lives in
// the reps, the counters and the text beats.
export const panelCamera = (frame: number): CamState => ({
  pos: [0, 2.0, 4.9 - 0.4 * (frame / (TOTAL_FRAMES - 1))],
  target: [0, 1.84, 0],
  fov: 42,
});

export const TheRepReport: React.FC = () => {
  const frame = useCurrentFrame();
  const states = panelStates(frame);
  const cam = panelCamera(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {PANELS.map((panel, i) => (
        <AbsoluteFill
          key={panel.key}
          style={{ top: panelTop(i), height: PANEL_H, bottom: "auto" }}
        >
          <ThreeCanvas width={1080} height={PANEL_H}>
            <color attach="background" args={[BG]} />
            <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />
            <GymPanel
              color={panel.color}
              state={states[i]}
              dim={panel.key === "steady" ? 1 : loserDim(frame)}
            />
          </ThreeCanvas>
        </AbsoluteFill>
      ))}

      <Frame />
      <PanelHud />
      <Beats />
      <Vignette />
      {/* No fade-out — the tableau + CTA hold to the last frame (v7 mechanic). */}
      <FadeLayer fadeInEnd={T.fadeInEnd} fadeOutStart={TOTAL_FRAMES} totalFrames={TOTAL_FRAMES} />
      {/* <Audio src={staticFile("audio/e02-the-rep-report.mp3")} /> */}
    </AbsoluteFill>
  );
};
