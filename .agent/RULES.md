# STANDING RULES — every agent, every session, no exceptions

Authority order: user's live instruction > RULES.md > SKILLS.md > LESSONS.md.

## Process rules

1. **READ-FIRST** — At session start, read `.agent/RULES.md` + top of `.agent/IMPROVEMENTS.md`. Before touching visuals, read `.agent/LESSONS.md`. Before starting an episode, read `.agent/SKILLS.md` § Episode lifecycle.
2. **NO ASSUMPTIONS** — Never assume anything you are not 100% sure about. **ASK the user.** Applies to: creative direction, story, structure, naming, scope, gating decisions. Small numeric tuning (positions/sizes/timings) may be decided and flagged in the hand-off report for correction.
3. **NO FINAL RENDER** — Never run `remotion render` to MP4 without the user's explicit approval of the live preview at localhost:3000. QA frame stills (PNG) are always allowed and required (user-confirmed 2026-11-11). After an approved render, DELETE all temp QA stills.
4. **FULL-FRAME QA BEFORE HAND-OFF** — Before telling the user the preview is ready: render stills for EVERY frame, tile into contact sheets, read every sheet, plus full-res reads at every beat/transition (SKILLS § QA frame sweep). Verify: composition, camera continuity (zero cuts), pose/gait sanity, text timing/legibility/coverage, life elements, mood/pacing, fades, brand mark, audio plan. Fix anything off → re-sweep → then hand over.
5. **MOTIVATED CAMERA & CUTS** — Camera motion must be purposeful and continuous during scene progressions, but **motivated cuts / spotlight punch-ins are explicitly allowed and encouraged** at moments of high dramatic tension, character crises, or sudden breakthroughs (as proven by top-performing shorts like v7). Avoid gratuitous MTV cuts, but never sacrifice emotional impact for a dogmatic "zero cuts" rule.
6. **TEXT** — Simple readable font, weight ≤ 600. Never covers the subject or a key visual. The most crucial line is the LARGEST; text hierarchy = story importance.
7. **STORY & HUMAN METAPHOR** — Every episode must be a creative, emotionally resonant human fable with tangible narrative stakes and a clear transformative payoff. Avoid dry, literal gym exercises (pull-ups, push-ups) or repetitive mechanical acts (hamster wheels) unless requested. Premise text readable from ~frame 1. Payoff = tonal flip right before the message; the message holds alone at the end.
8. **PACING** — Something must change every 1–2.5s. Punchy episodes run 9–15.5s; Type B comparison episodes may run ~24s (v6/v7 prove the type breathes longer) with user sign-off.
9. **CODE & ARCHITECTURE (HYBRID 3D + 2D)** — Modular and clean. No file over ~200 lines (split it). Strictly 100% web-based tech stack (Remotion, React Three Fiber, Canvas, SVG) — no external 3D software (no Blender). Visual standard is **Hybrid 3D+2D**: 3D environment/props/lighting/depth + expressive 2D character silhouettes/billboards. Reusable logic goes in `app/src/shared/`. Episodes are self-contained and RETAINED forever: any past episode must remain previewable/renderable.
10. **SELF-IMPROVEMENT LOOP (mandatory)** — End every session by: appending new discoveries to `.agent/LESSONS.md`, promoting recurring lessons (2+) into RULES, and re-ranking `.agent/IMPROVEMENTS.md`. The project must get better with every session, regardless of which agent works on it.
11. **DUAL-RESOLUTION RENDER (user rule, 2026-11-11)** — Every episode renders in BOTH resolutions unless the user changes it: 1080×1920 → `out/<id>-1080.mp4`, and 4K 2160×3840 → `out/<id>-4k.mp4` (same composition, `--scale=2`). Spot-check one extracted frame from each file after rendering.
12. **GPU-FIRST RENDERING (user rule, 2026-11-11)** — Don't throw render work on the CPU: WebGL (three.js scenes) rasterizes via ANGLE (`setChromiumOpenGlRenderer('angle')` in remotion.config.ts) and frame encoding uses NVENC when available (`setHardwareAcceleration('if-possible')`). NVENC ignores CRF — control file size with `--video-bitrate` (~8M at 1080, ~24M at 4K).

## Confirmed decisions (log)

- 2026-11-11 — QA stills allowed; MP4 render gated behind live-preview approval; delete temp stills after approved render.
- 2026-11-11 — Composition IDs are episode-numbered: `e01-the-wheel`, `e02-…`.
- 2026-11-11 — Zero hard cuts; continuous camera motion only.
- 2026-11-11 — "Direction is." is the hero line of e01 — it must be the biggest text on screen.
- 2026-11-11 — Project layout: `app/` holds the Remotion repo; project root holds `.agent/`, `references/`, `out/`, README.
- 2026-11-11 — Dual-resolution output is standing policy (user rule 11): `<id>-1080.mp4` + `<id>-4k.mp4` for every episode render.
- 2026-11-11 — GPU-first rendering is standing policy (user rule 12): ANGLE for WebGL rasterization, NVENC for encoding, `--video-bitrate` instead of CRF.
- 2026-11-11 — e02 brief locked: Type B comparison, "NO WIND DAY" (4 kites, 1 windless field, zero cuts), v6 single-frame + v7 counters/tags/CTA, ~24s (user cap: under 32s).
- 2026-11-12 — Hybrid 3D+2D web stack policy: pure web tech (Remotion + Three.js + Canvas/SVG, NO Blender). 3D world + 2D anime/stylized silhouettes. Motivated cuts/spotlights permitted for dramatic impact. High-contrast signature accents (crimson/amber). Creative human fables over dry gym reps.
- 2026-11-12 — e04 brief locked: Type D Hybrid 3D+2D, "The Weight You Carry" (two travelers, crumbling stone chasm in 3D void, heavy slab becomes the bridge, crimson accent scarf, anime silhouette).
