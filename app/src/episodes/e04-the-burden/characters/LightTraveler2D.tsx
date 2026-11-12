import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LIGHT_TRAVELER_BODY, LIGHT_TRAVELER_RIM } from "../palette";
import { BEATS } from "../timeline";

interface LightTravelerProps {
  x: number;
  y: number;
  z?: number;
  frame: number;
}

export const LightTraveler2D: React.FC<LightTravelerProps> = ({ x, y, z = 0, frame }) => {
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return { canvas: c, texture: t };
  }, []);

  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 512, 512);

    const isRunning = frame >= 25 && frame < 150;
    const isTrapped = frame >= 150;
    const isDefeated = frame >= BEATS.slamImpact;

    const runFreq = 0.45;
    const runPhase = isRunning ? Math.sin(frame * runFreq) : 0;
    const runBob = isRunning ? Math.abs(Math.sin(frame * runFreq * 2)) * 8 : 0;

    const cx = 256;
    const cy = 250 + runBob;

    ctx.save();
    ctx.fillStyle = LIGHT_TRAVELER_BODY;
    ctx.strokeStyle = LIGHT_TRAVELER_RIM;
    ctx.lineWidth = 2.5;

    if (isDefeated) {
      // 1. Defeated / sitting in despair state at edge
      // Head down
      ctx.beginPath();
      ctx.arc(cx - 10, cy + 10, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Slumped torso
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 20);
      ctx.lineTo(cx + 10, cy + 25);
      ctx.lineTo(cx + 5, cy + 65);
      ctx.lineTo(cx - 25, cy + 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Knees pulled up
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 60);
      ctx.lineTo(cx + 15, cy + 50);
      ctx.lineTo(cx + 25, cy + 85);
      ctx.lineTo(cx - 10, cy + 85);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (isTrapped) {
      // 2. Trapped panic state at the edge (arms waving / leaning over void)
      const panicShake = Math.sin(frame * 0.8) * 4;

      // Head tilted looking down into the abyss
      ctx.beginPath();
      ctx.arc(cx + 15 + panicShake, cy - 65, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Leaning torso
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy - 50);
      ctx.lineTo(cx + 25, cy - 45);
      ctx.lineTo(cx + 10, cy + 10);
      ctx.lineTo(cx - 15, cy + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Arms reaching out in alarm
      ctx.beginPath();
      ctx.moveTo(cx + 20, cy - 40);
      ctx.lineTo(cx + 60, cy - 55 + panicShake * 2);
      ctx.lineTo(cx + 70, cy - 40);
      ctx.stroke();

      // Tense legs
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + 10);
      ctx.lineTo(cx - 25, cy + 50);
      ctx.lineTo(cx - 20, cy + 90);
      ctx.moveTo(cx + 8, cy + 10);
      ctx.lineTo(cx + 15, cy + 50);
      ctx.lineTo(cx + 20, cy + 90);
      ctx.stroke();
    } else {
      // 3. Fast sprinting / casual leap state
      // Upright head
      ctx.beginPath();
      ctx.arc(cx + 12, cy - 70, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Running torso
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 55);
      ctx.lineTo(cx + 22, cy - 50);
      ctx.lineTo(cx + 10, cy + 5);
      ctx.lineTo(cx - 15, cy + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Free swinging arms (holding nothing)
      ctx.beginPath();
      ctx.moveTo(cx + 15, cy - 45);
      ctx.lineTo(cx + 45 + runPhase * 25, cy - 25);
      ctx.moveTo(cx - 10, cy - 45);
      ctx.lineTo(cx - 35 - runPhase * 25, cy - 25);
      ctx.stroke();

      // Fast running legs
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy + 5);
      ctx.lineTo(cx - runPhase * 40, cy + 50);
      ctx.lineTo(cx - runPhase * 50, cy + 90);
      ctx.moveTo(cx + 8, cy + 5);
      ctx.lineTo(cx + runPhase * 40, cy + 50);
      ctx.lineTo(cx + runPhase * 50, cy + 90);
      ctx.stroke();
    }

    ctx.restore();
    texture.needsUpdate = true;
  }, [canvas, texture, frame]);

  return (
    <group position={[x, y + 0.95, z]}>
      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.4, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* 2D Billboard */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.3, 2.3]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.01}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
