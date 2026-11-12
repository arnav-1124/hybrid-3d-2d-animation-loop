import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
// Music slot: drop a licensed track at app/public/audio/e01-the-wheel.mp3, then uncomment:
// import { Audio, staticFile } from "remotion";

import { ThreeCanvas } from "@remotion/three";

import { cameraState } from "./camera";
import { moodDim, speedProfile, stickState, T, TOTAL_FRAMES, wheelAngle } from "./timeline";
import { TextBeats } from "./text-beats";
import { WheelScene } from "./WheelScene";
import { Stickman3D } from "../../shared/stickman/Stickman3D";
import { CameraRig } from "../../shared/three/CameraRig";
import { BrandMark } from "../../shared/overlays/BrandMark";
import { FadeLayer, MoodDim, Vignette } from "../../shared/overlays/Layers";
import { SpeedLines } from "../../shared/overlays/SpeedLines";
import { BG } from "./palette";

export const TheWheel: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cam = cameraState(frame);
  const stick = stickState(frame);
  const angle = wheelAngle(frame);
  const speed = speedProfile(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <ThreeCanvas width={width} height={height}>
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 18, 60]} />
        <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />
        <WheelScene angle={angle} speed={speed} />
        <Stickman3D
          root={stick.root}
          phase={stick.phase}
          a={stick.a}
          b={stick.b}
          mix={stick.mix}
          headPitch={stick.headPitch}
          sweat={speed}
        />
      </ThreeCanvas>

      <SpeedLines speed={speed} />
      <MoodDim opacity={moodDim(frame)} />
      <TextBeats />
      <BrandMark />
      <Vignette />
      <FadeLayer fadeInEnd={T.fadeInEnd} fadeOutStart={T.fadeOutStart} totalFrames={TOTAL_FRAMES} />
      {/* <Audio src={staticFile("audio/e01-the-wheel.mp3")} /> */}
    </AbsoluteFill>
  );
};
