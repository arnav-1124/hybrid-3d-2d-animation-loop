import React from "react";
import { Composition } from "remotion";
import { e01TheWheel } from "./episodes/e01-the-wheel";
import { e02TheRepReport } from "./episodes/e02-the-rep-report";
import { e04TheBurden } from "./episodes/e04-the-burden";

// Episode registry — every episode ever built stays registered forever (RULE 9),
// so any past episode remains previewable/renderable.
interface EpisodeMeta {
  id: string;
  component: React.FC<Record<string, unknown>>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
}

export const EPISODES: readonly EpisodeMeta[] = [
  e01TheWheel,
  e02TheRepReport,
  e04TheBurden,
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {EPISODES.map((e) => (
        <Composition
          key={e.id}
          id={e.id}
          component={e.component}
          durationInFrames={e.durationInFrames}
          fps={e.fps}
          width={e.width}
          height={e.height}
        />
      ))}
    </>
  );
};
