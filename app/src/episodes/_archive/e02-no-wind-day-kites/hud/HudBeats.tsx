// Story text: premise header -> thesis flip -> HERO line -> CTA (v7 hold).
// Rule 6: the hero line is the biggest text; everything sits in the sky band
// above the lanes / below the characters, never covering a subject.
import React from "react";
import { TextBeat } from "../../../shared/overlays/TextBeat";
import { AMBER, MUTED, RED } from "../palette";
import { T } from "../timeline";

export const HudBeats: React.FC = () => (
  <>
    <TextBeat from={T.header[0]} to={T.header[1]} y={210} size={64}>
      NO WIND DAY.
    </TextBeat>
    <TextBeat from={T.header[0]} to={T.header[1]} y={310} size={30} color={MUTED} dim>
      four kites. zero breeze.
    </TextBeat>
    <TextBeat from={T.thesis[0]} to={T.thesis[1]} y={430} size={62} dim>
      WIND ISN&rsquo;T <span style={{ color: RED }}>WEATHER.</span>
    </TextBeat>
    <TextBeat from={T.hero[0]} to={T.hero[1]} y={640} size={94} color={AMBER} slam glow>
      MOTION MAKES WIND.
    </TextBeat>
    <TextBeat from={T.cta[0]} to={T.cta[1]} y={1560} size={46}>
      WHICH KITE IS YOURS?
    </TextBeat>
  </>
);
