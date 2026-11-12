import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
// Music slot: drop a licensed track at app/public/audio/e02-no-wind-day.mp3, then uncomment:
// import { Audio, staticFile } from "remotion";

import { ThreeCanvas } from "@remotion/three";

import { cameraState } from "./camera";
import { laneStates } from "./characters";
import { HudBeats } from "./hud/HudBeats";
import { LaneModules } from "./hud/LaneModules";
import { loserDim, LANES, T, TOTAL_FRAMES } from "./timeline";
import { FieldScene } from "./scene/FieldScene";
import { LaneScene } from "./scene/LaneScene";
import { BG } from "./palette";
import { BrandMark } from "../../shared/overlays/BrandMark";
import { CameraRig } from "../../shared/three/CameraRig";
import { FadeLayer, Vignette } from "../../shared/overlays/Layers";

export const NoWindDay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cam = cameraState(frame);
  const states = laneStates(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 26, 78]} />
        <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />
        <FieldScene />
        {LANES.map((lane, i) => (
          <LaneScene
            key={lane.key}
            lane={lane}
            state={states[i]}
            dim={lane.key === "steady" ? 1 : loserDim(frame)}
          />
        ))}
      </ThreeCanvas>

      <LaneModules cam={cam} states={states} />
      <HudBeats />
      <BrandMark />
      <Vignette />
      {/* No fade-out — the tableau + CTA hold to the last frame (v7 mechanic). */}
      <FadeLayer fadeInEnd={T.fadeInEnd} fadeOutStart={TOTAL_FRAMES} totalFrames={TOTAL_FRAMES} />
      {/* <Audio src={staticFile("audio/e02-no-wind-day.mp3")} /> */}
    </AbsoluteFill>
  );
};
