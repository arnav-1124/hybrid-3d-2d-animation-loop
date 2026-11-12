# Episode template

Copy this folder to a new episode, then follow the lifecycle in `.agent/SKILLS.md`.

## Steps

1. Get the user's OK on **type** (`.agent/TYPES.md`) + **story brief** first (RULE 2).
2. Copy: `cp -r app/src/episodes/_template app/src/episodes/eNN-slug`.
3. In the new folder: rename `eNNTemplate` → `eNNSlug`, set `id: "eNN-slug"`.
4. Register it in `app/src/Root.tsx` (append to `EPISODES`).
5. Build order: `timeline.ts` (beats + speed profile) → `camera.ts` (ONE continuous
   CR path through keyframes — RULE 5: zero cuts) → scene components → `text-beats.tsx`.
6. Reuse the shared engine: `shared/palette`, `shared/types`, `shared/three/*`,
   `shared/stickman/*`, `shared/overlays/*`. Episode-only constants go in `palette.ts`.
7. Run the QA frame sweep (SKILLS § QA frame sweep) — fix → re-sweep → hand off.
8. Episodes are RETAINED forever (RULE 9): never delete or unregister an old episode.

## Camera constraints

- Stickman rig is 2D side-view facing +X → keep camera within ~±50° azimuth of the ±Z axis.
- One continuous spline for the whole episode; keyframe spacing = pacing.
- Handheld shake is additive and speed-scaled; never teleport the camera.
