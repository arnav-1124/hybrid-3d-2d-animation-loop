import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CRIMSON_ACCENT, CRIMSON_GLOW, SILHOUETTE_BODY, SILHOUETTE_RIM } from "../palette";
import { BEATS } from "../timeline";

interface AnimeSilhouetteProps {
  x: number;
  y: number;
  z?: number;
  frame: number;
  facingRight?: boolean;
}

export const AnimeSilhouette2D: React.FC<AnimeSilhouetteProps> = ({
  x,
  y,
  z = 0,
  frame,
  facingRight = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // Initialize in-memory canvas & Three.js CanvasTexture once
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const t = new THREE.CanvasTexture(c);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return { canvas: c, texture: t };
  }, []);

  canvasRef.current = canvas;
  textureRef.current = texture;

  // Draw 2D Anime silhouette every frame
  useEffect(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 512, 512);

    const isSlamming = frame >= BEATS.slamStart && frame < BEATS.slamImpact + 10;
    const isCrossing = frame >= BEATS.crossStart;
    const isWalking = (frame < BEATS.reunionEnd || isCrossing) && !isSlamming;

    // Walk phase for leg/stride animation
    const walkFreq = isCrossing ? 0.28 : 0.22;
    const legPhase = isWalking ? Math.sin(frame * walkFreq) : 0;
    const bodyBob = isWalking ? Math.abs(Math.sin(frame * walkFreq * 2)) * 6 : 0;

    // Center coordinates on the 512x512 canvas
    const cx = 256;
    const cy = 250 + bodyBob;

    ctx.save();
    if (!facingRight) {
      ctx.translate(512, 0);
      ctx.scale(-1, 1);
    }

    // 1. FLOWING CRIMSON SCARF / CLOAK (Procedural Cloth Physics)
    ctx.save();
    ctx.shadowColor = CRIMSON_GLOW;
    ctx.shadowBlur = 14;
    ctx.fillStyle = CRIMSON_ACCENT;
    ctx.strokeStyle = CRIMSON_ACCENT;
    ctx.lineWidth = 6;

    const windSpeed = frame * 0.35;
    const scarfStartX = cx - 20;
    const scarfStartY = cy - 65;

    // Scarf ribbon 1 (Upper trailing ribbon)
    ctx.beginPath();
    ctx.moveTo(scarfStartX, scarfStartY);
    const s1x = scarfStartX - 60 - Math.cos(windSpeed) * 15;
    const s1y = scarfStartY - 10 + Math.sin(windSpeed) * 16;
    const s2x = scarfStartX - 130 - Math.sin(windSpeed * 0.8) * 20;
    const s2y = scarfStartY + 5 + Math.cos(windSpeed * 0.9) * 24;
    const s3x = scarfStartX - 210 - Math.cos(windSpeed * 0.7) * 25;
    const s3y = scarfStartY + 20 + Math.sin(windSpeed * 1.1) * 30;

    ctx.bezierCurveTo(s1x, s1y, s2x, s2y, s3x, s3y);
    ctx.lineTo(s3x + 10, s3y + 14);
    ctx.bezierCurveTo(s2x + 15, s2y + 12, s1x + 10, s1y + 8, scarfStartX + 5, scarfStartY + 8);
    ctx.closePath();
    ctx.fill();

    // Scarf ribbon 2 (Lower billowing cloak wing)
    ctx.beginPath();
    ctx.moveTo(scarfStartX - 5, scarfStartY + 5);
    const c1x = scarfStartX - 80 - Math.sin(windSpeed * 1.1) * 18;
    const c1y = scarfStartY + 30 + Math.cos(windSpeed * 0.8) * 16;
    const c2x = scarfStartX - 160 - Math.cos(windSpeed * 0.9) * 22;
    const c2y = scarfStartY + 55 + Math.sin(windSpeed) * 25;
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, s3x - 10, s3y + 40);
    ctx.lineTo(s3x, s3y + 25);
    ctx.bezierCurveTo(c2x + 10, c2y + 15, c1x + 10, c1y + 10, scarfStartX + 5, scarfStartY + 15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. MAIN ANIME BODY SILHOUETTE (Dark with sharp rim highlight)
    ctx.save();
    ctx.fillStyle = SILHOUETTE_BODY;
    ctx.strokeStyle = SILHOUETTE_RIM;
    ctx.lineWidth = 3;

    // LEGS: sharp angled stance
    const leftHipX = cx - 12;
    const rightHipX = cx + 8;
    const hipY = cy - 10;

    const leftFootX = leftHipX - legPhase * 32;
    const leftFootY = cy + 95 - Math.max(0, legPhase) * 18;
    const rightFootX = rightHipX + legPhase * 32;
    const rightFootY = cy + 95 - Math.max(0, -legPhase) * 18;

    // Left leg
    ctx.beginPath();
    ctx.moveTo(leftHipX, hipY);
    ctx.lineTo(leftHipX - 8 - legPhase * 16, cy + 40);
    ctx.lineTo(leftFootX, leftFootY);
    ctx.lineTo(leftFootX + 16, leftFootY);
    ctx.lineTo(leftHipX + 8, hipY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right leg
    ctx.beginPath();
    ctx.moveTo(rightHipX, hipY);
    ctx.lineTo(rightHipX + 8 + legPhase * 16, cy + 40);
    ctx.lineTo(rightFootX, rightFootY);
    ctx.lineTo(rightFootX + 16, rightFootY);
    ctx.lineTo(rightHipX - 4, hipY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // TORSO & HOODED CLOAK
    ctx.beginPath();
    ctx.moveTo(cx - 28, cy - 65); // Left shoulder
    ctx.lineTo(cx + 26, cy - 60); // Right shoulder (angled forward)
    ctx.lineTo(cx + 18, cy - 5);  // Waist right
    ctx.lineTo(cx - 22, cy - 8);  // Waist left
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // HOODED HEAD (Angled sleek anime hood)
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy - 65);
    ctx.bezierCurveTo(cx - 20, cy - 105, cx + 18, cy - 110, cx + 22, cy - 75);
    ctx.lineTo(cx + 26, cy - 68);
    ctx.lineTo(cx - 10, cy - 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // GLOWING CRIMSON EYE SLIT
    ctx.save();
    ctx.shadowColor = CRIMSON_GLOW;
    ctx.shadowBlur = 10;
    ctx.fillStyle = CRIMSON_ACCENT;
    ctx.beginPath();
    ctx.moveTo(cx + 12, cy - 78);
    ctx.lineTo(cx + 22, cy - 77);
    ctx.lineTo(cx + 14, cy - 74);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ARMS (Heaving / holding stance)
    if (isSlamming) {
      // Both arms thrust forward in slam posture
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 60);
      ctx.lineTo(cx + 45, cy - 30);
      ctx.lineTo(cx + 65, cy - 10);
      ctx.lineTo(cx + 50, cy - 5);
      ctx.lineTo(cx - 5, cy - 45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Carrying grip: right arm raised holding the slab
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 60);
      ctx.lineTo(cx + 15, cy - 85);
      ctx.lineTo(cx + 32, cy - 80);
      ctx.lineTo(cx + 18, cy - 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();

    texture.needsUpdate = true;
  }, [canvas, texture, frame, facingRight]);

  return (
    <group position={[x, y + 0.95, z]}>
      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.45, 18]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>

      {/* 2D Anime Silhouette Billboard */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
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
