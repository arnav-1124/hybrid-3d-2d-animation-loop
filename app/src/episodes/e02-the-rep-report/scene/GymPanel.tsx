// One stacked panel's 3D scene: void, lights, the bar, the stickman.
// All four panels share the same camera (TheRepReport.tsx) — same test, same
// framing, a fair comparison. Losers' scenes dim with the brightness hierarchy.
import React from "react";
import { STAND } from "../../../shared/stickman/pose";
import { Stickman3D } from "../../../shared/stickman/Stickman3D";
import { shade } from "../../../shared/palette";
import { Strut } from "../../../shared/three/Strut";
import { DustMotes } from "../../../shared/three/DustMotes";
import type { RepState } from "../characters/types";
import { BAR_HALF, BAR_Y, BAR_Z } from "../rig";

// The bar is real hardware: a steel shaft with grip tape in the middle,
// collars and end caps at the tips. Bare painted cylinders read as a drawn
// line; metal + a rim light is what makes it sit in the room.
const BAR_R = 0.058;
const GRIP_HALF = 0.55;
const SLEEVE_R = 0.079;
const CAP_R = 0.088;

const SteelBar: React.FC<{ color: string; dim: number }> = ({ color, dim }) => {
  const steel = shade("#9aa1b0", dim);
  const tape = shade("#4b4f5b", dim);
  return (
    <>
      {/* shaft */}
      <Strut
        a={[-BAR_HALF, BAR_Y, BAR_Z]}
        b={[BAR_HALF, BAR_Y, BAR_Z]}
        r={BAR_R}
        segments={28}
        color={shade(color, dim)}
        roughness={0.3}
        metalness={0.55}
      />
      {/* matte grip section under the hands (chalked tape) */}
      <Strut
        a={[-GRIP_HALF, BAR_Y, BAR_Z]}
        b={[GRIP_HALF, BAR_Y, BAR_Z]}
        r={BAR_R + 0.003}
        segments={22}
        color={tape}
        roughness={0.95}
        metalness={0.02}
      />
      {/* sleeves + flared end caps, mirrored */}
      {[-1, 1].map((s) => (
        <React.Fragment key={s}>
          <Strut
            a={[s * (BAR_HALF - 0.44), BAR_Y, BAR_Z]}
            b={[s * (BAR_HALF - 0.14), BAR_Y, BAR_Z]}
            r={SLEEVE_R}
            segments={22}
            color={steel}
            roughness={0.34}
            metalness={0.7}
          />
          <Strut
            a={[s * (BAR_HALF - 0.14), BAR_Y, BAR_Z]}
            b={[s * (BAR_HALF - 0.01), BAR_Y, BAR_Z]}
            r={SLEEVE_R}
            r2={CAP_R}
            segments={22}
            color={steel}
            roughness={0.4}
            metalness={0.65}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export const GymPanel: React.FC<{
  color: string;
  state: RepState;
  dim: number;
}> = ({ color, state, dim }) => (
  <>
    {/* Key / fill / rim: shaping lights give the body and bar volume, where a
        single high ambient flattened them into silhouettes. */}
    <ambientLight intensity={0.55} />
    <hemisphereLight args={["#3f4358", "#05050a", 0.35]} />
    <directionalLight position={[3, 10, 8]} intensity={1.85} />
    <directionalLight position={[-7, 3, 5]} intensity={0.5} color="#8fa3ff" />
    <directionalLight position={[-2, 5, -7]} intensity={1.1} color="#a9c6ff" />

    <SteelBar color={color} dim={dim} />
    <Stickman3D
      root={[0, 0, 0]}
      phase={0}
      a={STAND}
      b={STAND}
      mix={0}
      headPitch={state.headPitch}
      sweat={state.sweat}
      joints={state.joints}
      yaw={state.yaw}
      brightness={dim}
      kit={{
        top: shade(color, dim * 0.87),
        bottom: shade("#3c4150", dim),
        shoe: shade("#262933", dim),
        hair: shade("#23242e", dim),
      }}
    />
    <DustMotes speed={0.06} count={130} baseOpacity={0.32} />
  </>
);
