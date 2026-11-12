import React, { useLayoutEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import type { V3 } from "../types";

// Camera that looks from pos at target.
// useLayoutEffect so it applies BEFORE @remotion/three's ManualFrameRenderer
// (a passive effect) advances the WebGL frame — otherwise stills/first frames
// render with the default camera.
export const CameraRig: React.FC<{ pos: V3; target: V3; fov: number }> = ({
  pos,
  target,
  fov,
}) => {
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.up.set(0, 1, 0);
    camera.lookAt(target[0], target[1], target[2]);
    const pcam = camera as THREE.PerspectiveCamera;
    if (pcam.isPerspectiveCamera) {
      pcam.fov = fov;
      pcam.updateProjectionMatrix();
    }
  });

  return null;
};
