// Shared geometry/camera types used across the engine and all episodes.
export type V2 = [number, number];
export type V3 = [number, number, number];

export interface CamState {
  pos: V3;
  target: V3;
  fov: number;
}
