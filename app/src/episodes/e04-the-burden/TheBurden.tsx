import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BG } from "./palette";
import {
  cameraPath,
  heavyCarrierX,
  lightRunnerX,
  screenShake,
  slabState,
} from "./timeline";
import { ChasmWorld } from "./scene/ChasmWorld";
import { AnimeSilhouette2D } from "./characters/AnimeSilhouette2D";
import { LightTraveler2D } from "./characters/LightTraveler2D";
import { BurdenHUD } from "./hud/BurdenHUD";
import { CameraRig } from "../../shared/three/CameraRig";
import { FadeLayer, Vignette } from "../../shared/overlays/Layers";

export const TheBurden: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cam = cameraPath(frame);
  const carrierX = heavyCarrierX(frame);
  const runnerX = lightRunnerX(frame);
  const slab = slabState(frame, carrierX);
  const [shakeX, shakeY] = screenShake(frame);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* 3D Three.js Environment with 2D Anime Silhouettes */}
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 12, 45]} />

        {/* Dynamic Motivated Camera */}
        <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />

        {/* 3D Atmospheric Chasm & Bridge */}
        <ChasmWorld frame={frame} slab={slab} />

        {/* 2D Traveler 1: The Light Runner */}
        <LightTraveler2D x={runnerX} y={0} frame={frame} />

        {/* 2D Traveler 2: The Anime Silhouette with Crimson Cloth Physics */}
        <AnimeSilhouette2D x={carrierX} y={0} frame={frame} />
      </ThreeCanvas>

      {/* Kinetic Typography & Dialogues */}
      <BurdenHUD frame={frame} />

      {/* Cinematic Overlays */}
      <Vignette />
      <FadeLayer fadeInEnd={15} fadeOutStart={448} totalFrames={450} />
    </AbsoluteFill>
  );
};
