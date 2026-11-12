// One lane = stickman + kite + string + lane-specific props, all dimmed by the
// brightness hierarchy (losers fade to near-black, the winner stays lit).
import React from "react";
import { STAND } from "../../../shared/stickman/pose";
import { Stickman3D } from "../../../shared/stickman/Stickman3D";
import { shade } from "../../../shared/palette";
import { Strut } from "../../../shared/three/Strut";
import type { LaneState } from "../characters/types";
import { SPAR } from "../palette";
import { Kite, NOSE_OFF, StringCurve } from "./Kite";

// World position of the kite's nose (top vertex), given center + tilt.
const kiteNose = (pos: [number, number, number], tilt: number): [number, number, number] => [
  pos[0] - Math.sin(tilt) * NOSE_OFF,
  pos[1] + Math.cos(tilt) * NOSE_OFF,
  pos[2],
];

const Pole: React.FC<{ x: number; dim: number }> = ({ x, dim }) => (
  <>
    <Strut a={[x + 0.95, 0, 0.3]} b={[x + 0.95, 2.05, 0.3]} r={0.035} color={shade(SPAR, dim)} />
    <mesh position={[x + 0.95, 0.03, 0.3]}>
      <boxGeometry args={[0.5, 0.06, 0.3]} />
      <meshStandardMaterial color={shade(SPAR, dim)} roughness={0.8} />
    </mesh>
  </>
);

// SHOWMAN's camera flash — a tiny white pulse at head height, right of his pole.
const Flash: React.FC<{ x: number; v: number }> = ({ x, v }) =>
  v <= 0.01 ? null : (
    <mesh position={[x + 1.35, 2.35, 1.5]}>
      <sphereGeometry args={[0.09, 10, 10]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={v * 0.95} depthWrite={false} />
    </mesh>
  );

export const LaneScene: React.FC<{
  lane: { key: string; x: number; color: string };
  state: LaneState;
  dim: number;
}> = ({ lane, state, dim }) => {
  const s = state;
  const nose = kiteNose(s.kite.pos, s.kite.tilt);
  return (
    <>
      <Stickman3D
        root={s.root}
        phase={0.3}
        a={STAND}
        b={STAND}
        mix={0}
        headPitch={s.headPitch}
        sweat={s.sweat}
        joints={s.joints}
        yaw={s.yaw}
        brightness={dim}
      />
      <Kite pos={s.kite.pos} tilt={s.kite.tilt} sway={s.kite.sway} color={lane.color} dim={dim} />
      <StringCurve anchor={s.kite.anchor} nose={nose} slack={s.kite.slack} dim={dim} />
      {lane.key === "show" && <Pole x={lane.x} dim={dim} />}
      {lane.key === "show" && <Flash x={lane.x} v={s.flash} />}
    </>
  );
};
