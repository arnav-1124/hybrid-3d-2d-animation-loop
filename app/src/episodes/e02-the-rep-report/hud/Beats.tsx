// Story text: title -> thesis flip -> HERO line -> CTA (v7 hold).
// Rule 6: the hero line is the biggest text. Quiet lines stay in the top
// strip, which they time-share. The hero line is a motion-graphics beat: it
// travels UP from below the frame and settles high on the canvas (clear of
// every live character and HUD module) — parked in the 190px footer it was
// clipped by the bottom edge.
import React from "react";
import { TextBeat } from "../../../shared/overlays/TextBeat";
import { AMBER, MUTED, RED } from "../palette";
import { T } from "../timeline";

export const Beats: React.FC = () => (
  <>
    <TextBeat from={T.title[0]} to={T.title[1]} y={10} size={46}>
      THE REP REPORT.
    </TextBeat>
    <TextBeat from={T.title[0]} to={T.title[1]} y={68} size={19} color={MUTED} dim>
      four men. one bar.
    </TextBeat>
    <TextBeat from={T.thesis[0]} to={T.thesis[1]} y={18} size={54} dim>
      DISCIPLINE ISN&rsquo;T <span style={{ color: RED }}>LUCK.</span>
    </TextBeat>
    <TextBeat from={T.hero[0]} to={T.hero[1]} y={420} size={84} color={AMBER} rise slam glow>
      DISCIPLINE MAKES STRENGTH.
    </TextBeat>
    <TextBeat from={T.cta[0]} to={T.cta[1]} y={28} size={46}>
      WHICH ONE ARE YOU?
    </TextBeat>
  </>
);
