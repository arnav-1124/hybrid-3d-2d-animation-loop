# reality-loop — programmatic vertical shorts (Remotion + Three.js)

```
.agent/        agent brain — READ FIRST (RULES, LESSONS, SKILLS, IMPROVEMENTS)
app/           the Remotion repo
  src/index.ts           entry — registerRoot
  src/Root.tsx           registers every episode composition
  src/shared/            reusable engine (stickman, three bits, camera path, overlays) — no story code
  src/episodes/          one folder per video, RETAINED forever
    e01-the-wheel/
    _template/           starter for the next episode
  public/audio/          per-episode music (eNN-slug.mp3)
references/    research videos, frame extracts, ANALYSIS.md
out/           QA stills + sheets (temp) and approved renders
```

## Commands (run inside `app/`)

- `npm start` — Remotion Studio at localhost:3000
- `npm run typecheck` — `tsc --noEmit`
- QA stills: `npx remotion render src/index.ts e01-the-wheel out/qa/seq --sequence --image-format=png --scale=0.25` (see .agent/SKILLS.md § QA frame sweep)
- MP4 render — GATED: only after the user approves the live preview.

Any agent working here must follow `.agent/RULES.md` — especially: no assumptions (ask), no MP4 render without approval, full-frame QA before hand-off, zero hard cuts, modular code.
