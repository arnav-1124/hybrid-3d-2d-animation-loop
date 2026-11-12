# SELF-IMPROVEMENT LOOP — the project gets better every session

## The loop (any agent, every session)

1. **Before work** — read RULES.md + this backlog (top items first).
2. **During** — anything surprising, broken, or annoying → append to `LESSONS.md` immediately. Do not trust memory.
3. **After hand-off** — record how the user reacted. User corrections are the highest-value signal: they become lessons, and if the same theme appears twice it is promoted into RULES.md (then removed from this backlog).
4. **Never delete** lessons; prune only stale backlog items that were done or made obsolete.
5. Keep this list ranked by impact — newest insights can jump to the top.

## Backlog (ranked by impact)

- [ ] **e04 "The Weight You Carry" (Type D Hybrid 3D+2D Anime Silhouette Fable)** — 3D crumbling stone chasm in Three.js + 2D anime silhouette with flowing cloth physics and crimson accent. Story of carrying the heavy stone that becomes the bridge. Pure web tech stack (Remotion + Three.js).
- [x] e02 "The Rep Report" (type B comparison, 4 pull-up panels, one winner, zero cuts) — built 2026-11-11 from the user-locked brief. Readability pass 2026-11-11: thicker bar + stickman limbs + bigger left-side HUD. QA sweep pending; then preview hand-off.
- [ ] Motion blur / multi-sample for the spinning wheel (strobing at full speed).
- [ ] Music: get a licensed track, retime beats to BPM (SKILLS § Music retime). Audio slot is wired and waiting.
- [ ] Soft contact shadow under the walker/hopper (grounding — figures float above the grid).
- [~] Auto text-safe-zones — `worldToScreen()` in `shared/projection.ts` now powers e02's camera-tracking HUD; next step: QA assertion that text never intersects subject bounds.
- [ ] Camera speed-ramp feel at the payoff (subtle slow-mo as the wheel stops).
- [ ] Amber glint on the wheel rim at full speed (energy accent tied to speedProfile).
- [x] Per-episode review notes — e01: user approved as-is ("It's great"); 1080 + 4K rendered; QA stills deleted after the render.
- [~] Verify `_template` episode typechecks and copies cleanly — e02 was built on e01's pattern instead; template still unexercised (do it at e03).
- [ ] Consider git init for episode versioning — ASK the user first (rule 2).

## Review history

- 2026-11-11 (e01 build): user corrections that shaped rules — no hard cuts (was: station cuts), hero line must be biggest (was: small amber sub-line), font too bold (was: Arial Black 900). All promoted to RULES.
- 2026-11-11 (e01 hand-off): user approved with no changes ("It's great"). New standing rule from this session: every episode renders 1080 + 4K (RULES #11). e01 delivered: `e01-the-wheel-1080.mp4` (15.5s, 14.3 MB) + 4K pass.
- 2026-11-11 (e02 build): brief locked via user Q&A (pull-up comparison: 4 panels, one winner, zero cuts, v6/v7 brain, under 32s). Built in one pass; readability pass then QA sweep.
- 2026-11-12 (Strategic Pivot & e04 brief): User identified core flaw in visual quality (procedural 3D cylinder stickmen looked stiff/CAD-like, rated ~2.5/10) and repetitive storytelling (pull-ups/hamster wheel). Pivoted to **Hybrid 3D+2D Web Stack**: 3D environment/lighting/depth in Three.js + 2D anime-style silhouette with flowing cloth physics and signature crimson accent in Remotion (no Blender). Updated Rule 5 to allow motivated dramatic cuts. Locked e04 story: "The Weight You Carry / The Stone Bridge".
