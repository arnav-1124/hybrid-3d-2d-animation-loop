// Brand palette — every episode draws from here so the series stays coherent.
// Palette rule: dark void bg, one ink color, amber = hope/truth, red = lie/friction.
export const BG = "#07070b";
export const INK = "#f4f4f8";
export const AMBER = "#ffb347";
export const RED = "#ff4d3d";
export const MUTED = "#8a8a96";

// Font rule (RULE 6): simple readable stack, weight never above 600.
export const FONT = '"Segoe UI", Inter, system-ui, sans-serif';
export const BRAND = "REALITY LOOP";

// Multiply a #rrggbb color by k (per-lane dimming for the brightness hierarchy).
export const shade = (hex: string, k: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number): number => Math.round(Math.max(0, Math.min(255, v * k)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
};
