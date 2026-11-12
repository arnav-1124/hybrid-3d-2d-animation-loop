# TYPES — registered video types

References with real audience data are distilled into TYPES, so every new episode starts
from a proven engine instead of from zero. Frame-verified detail lives in
`references/ANALYSIS.md`. New types are registered here after their reference is analyzed.

**How to use:** at episode start (SKILLS § Episode lifecycle step 2), propose a type +
story brief to the user together (rule 2). Our standing constraint RULE 5 (zero hard cuts)
applies to every type for OUR episodes unless the user explicitly relaxes it.

## Type A — Metaphor fable (one scene, one character, continuous camera)

The environment IS the argument. A single stickman enacts one metaphor; the payoff
re-reads the scene. No narration, no CTA clutter — the message holds alone.

- Verified refs: v1–v5 (ANALYSIS.md), our e01 "The Wheel" (wheel = everyone runs; direction beats speed).
- Engagement mechanics:
  - Premise readable from ~frame 1 (rule 7) — the viewer decodes the metaphor while the action runs.
  - Something changes every 1–2.5s (rule 8): speed, camera move, beat text, life elements.
  - Zero hard cuts (rule 5): one continuous camera path = one continuous thought.
  - Tonal flip right before the message; message holds ALONE at the end.
  - Hero line is the BIGGEST text on screen (rule 6).
- Best for: single-idea episodes, 9–15.5s, punchy.

## Type B — Comparison matrix (several characters, one virtue tested)

Several labeled characters run the same race, each carrying a failure mode; exactly one
wins — by doing LESS, not more. Ends by naming the winner and asking the viewer to
self-identify.

- Verified refs: v6 (static variant), v7 (leaderboard variant). Shared family: flat-white
  stickmen, colored identity accents, status vocabulary, "which one are you?" CTA.
- Engagement mechanics (shared engine):
  1. **Self-identification CTA** — "Which one are you?" drives comments; people report their type.
  2. **Sequential dropout drama** — each character fails differently, on schedule; every dropout is a fresh beat.
  3. **Status-tag vocabulary** — NO REST / GAVE UP / INJURED / BURNOUT / RESTING / FINISHED: state changes become named events.
  4. **Winner does LESS per second but lasts longest** — anti-climax as climax.
  5. **Counters as the story clock** — live numbers replace narration.
  6. **Brightness hierarchy at the end** — losers dim to near-black, winner stays lit.

### Variant B1 — Static matrix (v6)
- Zero cuts — compatible with RULE 5 as-is. Static camera + slow drift; everything in one frame.
- Labeled columns/frames, rotating red-accent header, end line names the winner in CAPS + red mark.
- Short and diagrammatic; the grid is the story.

### Variant B2 — Live leaderboard (v7)
- ~9 hard cuts: 4-lane overview ↔ solo full-bleed spotlight exactly at each character's
  crisis. Cut-to-spotlight IS its pacing engine.
- Live rank badges swap between lanes as counts change — the viewer roots for a RANK, not a face.
- ASCII-glyph particles (# * + ·) for confetti/injury; dotted-`#` skyline; per-lane ASCII medal.
- Thesis card slides in over the dimmed tableau, then bold CTA; HOLDS to the last frame (no fade-out).
- ⚠️ Uses hard cuts → conflicts with RULE 5 for our episodes. Two legal options: (a) adapt the
  spotlight to a continuous camera push-in (no cut), or (b) get the user's explicit rule exception.
  Decide WITH the user in the e02 brief (rule 2).

## Steal-list for e02 (type B — confirm with user first)

Live rank badges + counters as clock · status-tag vocabulary · solo spotlight per crisis
(as continuous camera push-in to respect rule 5) · dim-the-losers ending · thesis card +
"which one are you?" hold · text-world styling (glyph particles, ASCII skyline) to match brand.

## Type D — Hybrid 3D+2D Anime Silhouette Fable

A deep, atmospheric 3D environment (Three.js / React Three Fiber) housing expressive 2D anime-style silhouettes (dynamic billboards or screen-space tracking) with procedural cloth physics, high-contrast signature accents (crimson scarf/amber), and real emotional human stakes.

- **Stack**: 100% Web stack (Remotion + Three.js + Canvas/SVG). No Blender.
- **Visual mechanics**:
  - 3D world delivers real perspective depth, dramatic camera parallax, fog, and lighting.
  - 2D character delivers sharp, emotive, readable silhouette art without the stiffness of 3D polygon/cylinder puppets.
  - Secondary cloth dynamics (cape/scarf flowing with wind and movement) and particle dust/embers.
  - Motivated camera cuts/spotlights at crisis points (allowed by updated RULE 5).
- **Narrative engine**:
  - Deep human allegories (e.g. "The Weight You Carry / The Stone Bridge") instead of literal gym reps or mechanical loops.
  - The struggle itself holds the solution (the burden transforms into the bridge/breakthrough).
- **Best for**: Cinematic, high-retention motivational shorts (12–16s).
