import React from "react";
import { TextBeat } from "../../shared/overlays/TextBeat";
import { AMBER, RED } from "./palette";
import { T } from "./timeline";

// Text plan (RULE 6: hierarchy = story importance).
// Hero line "Direction is." is the BIGGEST text on screen: 118px amber slam + glow,
// positioned in the empty upper-middle band so it never covers the runner.
export const TextBeats: React.FC = () => {
  return (
    <>
      {/* y values chosen to sit in empty zones: above the runner, below the hub */}
      <TextBeat from={T.text1[0]} to={T.text1[1]} y={640} size={58}>
        FULL SPEED.
        <br />
        EVERY DAY.
      </TextBeat>
      <TextBeat from={T.text2[0]} to={T.text2[1]} y={380} size={62}>
        SO WHERE IS ALL
        <br />
        THIS GOING?
      </TextBeat>
      <TextBeat from={T.text3[0]} to={T.text3[1]} y={400} size={64} dim>
        MOTION ISN&rsquo;T
        <br />
        <span style={{ color: RED }}>PROGRESS.</span>
      </TextBeat>
      <TextBeat from={T.hero[0]} to={T.hero[1]} y={660} size={118} color={AMBER} slam glow>
        Direction is.
      </TextBeat>
    </>
  );
};
