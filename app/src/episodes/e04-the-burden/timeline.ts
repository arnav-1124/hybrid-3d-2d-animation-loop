// Timeline & animation state curves for e04 — "The Weight You Carry"
import { interpolate, spring } from "remotion";
import type { CamState, V3 } from "../../shared/types";

export const FPS = 30;
export const TOTAL_FRAMES = 450; // 15s

export const BEATS = {
  setupStart: 0,
  setupEnd: 90, // 3s: premise, light runner drops stone
  followStart: 90,
  followEnd: 180, // 6s: tight tracking on heavy carry
  crisisStart: 180,
  crisisEnd: 240, // 8s: motivated cut to edge, trapped
  reunionStart: 240,
  reunionEnd: 325, // 10.8s: heavy carrier arrives at edge
  slamStart: 325,
  slamImpact: 345, // 11.5s: bridge slams down
  crossStart: 365,
  crossEnd: 450, // 15s: crossing into dawn light
} as const;

// Traveler 1 (The Light Runner) X position
export function lightRunnerX(frame: number): number {
  if (frame < 25) return -4.0;
  if (frame < 150) {
    // Sprints fast ahead to the edge platform at x = 3.3
    const t = (frame - 25) / 125;
    return -4.0 + 7.3 * Math.min(1, t);
  }
  return 3.3; // Stuck at the edge of the chasm
}

// Traveler 2 (The Heavy Endurer) X position
export function heavyCarrierX(frame: number): number {
  if (frame < BEATS.reunionEnd) {
    // Steady, unyielding march: -4.5 -> 3.0 at frame 325
    const t = Math.min(1, Math.max(0, frame / BEATS.reunionEnd));
    return -4.5 + 7.5 * t;
  }
  if (frame < BEATS.crossStart) {
    return 3.0; // Stationary while slamming the slab
  }
  // Crossing across the bridge from 3.0 to 8.8 (frame 365 to 450)
  const t = Math.min(1, (frame - BEATS.crossStart) / (TOTAL_FRAMES - BEATS.crossStart));
  return 3.0 + 5.8 * t;
}

// Slab animation state: position and rotation
export interface SlabState {
  pos: V3;
  rot: V3; // euler angles [rx, ry, rz]
  carried: boolean;
  impactScale: number;
}

export function slabState(frame: number, carrierX: number): SlabState {
  const bridgeCenter: V3 = [5.5, 0.15, 0]; // Resting bridge position spanning x=3 to x=8
  
  if (frame < BEATS.slamStart) {
    // Carried on shoulder: rests diagonally on Traveler 2
    return {
      pos: [carrierX + 0.1, 1.4, -0.1],
      rot: [0, 0, -0.4],
      carried: true,
      impactScale: 1,
    };
  }
  
  if (frame < BEATS.slamImpact) {
    // The heave and slam arc (frame 325 -> 345)
    const t = (frame - BEATS.slamStart) / (BEATS.slamImpact - BEATS.slamStart);
    const easeT = t * t; // Acceleration downwards
    const x = interpolate(easeT, [0, 1], [carrierX + 0.1, bridgeCenter[0]]);
    const y = interpolate(easeT, [0, 0.4, 1], [1.4, 2.2, bridgeCenter[1]]);
    const rz = interpolate(easeT, [0, 1], [-0.4, 0]);
    return {
      pos: [x, y, 0],
      rot: [0, 0, rz],
      carried: false,
      impactScale: 1,
    };
  }

  // Slammed down! Bridge resting across the void gap
  const impactAge = frame - BEATS.slamImpact;
  // Subtle vibration right at impact
  const shake = impactAge < 10 ? Math.sin(impactAge * 2) * 0.05 * Math.exp(-impactAge * 0.3) : 0;
  return {
    pos: [bridgeCenter[0], bridgeCenter[1] + shake, bridgeCenter[2]],
    rot: [0, 0, 0],
    carried: false,
    impactScale: 1,
  };
}

// Screen shake calculation on impact (returns [shakeX, shakeY] in px)
export function screenShake(frame: number): [number, number] {
  if (frame < BEATS.slamImpact || frame > BEATS.slamImpact + 18) return [0, 0];
  const age = frame - BEATS.slamImpact;
  const decay = Math.exp(-age * 0.25);
  const sx = Math.sin(age * 3.5) * 16 * decay;
  const sy = Math.cos(age * 4.2) * 22 * decay;
  return [sx, sy];
}

// Camera state with motivated cuts and smooth tracking
export function cameraPath(frame: number): CamState {
  // SHOT 1: 0 - 90 (Wide-mid establishing the chasm and two paths)
  if (frame < BEATS.setupEnd) {
    const t = frame / BEATS.setupEnd;
    const x = interpolate(t, [0, 1], [-3.0, -1.0]);
    return {
      pos: [x, 2.6, 12.0],
      target: [x + 0.8, 1.2, 0],
      fov: 34,
    };
  }

  // SHOT 2: 90 - 180 (Tight dynamic tracking on Traveler 2 carrying the slab)
  if (frame < BEATS.followEnd) {
    const carrier = heavyCarrierX(frame);
    return {
      pos: [carrier + 0.8, 2.0, 7.5],
      target: [carrier + 0.2, 1.4, 0],
      fov: 32,
    };
  }

  // SHOT 3: 180 - 240 (MOTIVATED CUT: Traveler 1 trapped at the edge of the chasm)
  if (frame < BEATS.crisisEnd) {
    const t = (frame - BEATS.crisisStart) / (BEATS.crisisEnd - BEATS.crisisStart);
    // Low-angle dramatic push on the edge
    return {
      pos: [3.8 + t * 0.3, 1.2, 6.2],
      target: [3.4, 1.1, 0],
      fov: 36,
    };
  }

  // SHOT 4: 240 - 325 (Medium shot: Traveler 2 approaches edge, joining Traveler 1)
  if (frame < BEATS.slamStart) {
    const carrier = heavyCarrierX(frame);
    return {
      pos: [carrier + 1.2, 2.4, 9.5],
      target: [carrier + 0.8, 1.2, 0],
      fov: 33,
    };
  }

  // SHOT 5: 325 - 365 (MOTIVATED DRAMATIC ANGLE: The Bridge Slam impact)
  if (frame < BEATS.crossStart) {
    return {
      pos: [4.8, 2.8, 9.8],
      target: [5.2, 1.0, 0],
      fov: 36,
    };
  }

  // SHOT 6: 365 - 450 (HERO DOLLY: Stepping across into the dawn light)
  const t = (frame - BEATS.crossStart) / (TOTAL_FRAMES - BEATS.crossStart);
  const cx = heavyCarrierX(frame);
  return {
    pos: [cx - 0.5, 2.2 + t * 0.6, 9.0 + t * 1.5],
    target: [cx + 0.8, 1.4, 0],
    fov: 35,
  };
}
