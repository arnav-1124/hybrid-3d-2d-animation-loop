# LESSONS — append-only log. Format: `- YYYY-MM-DD (episode): lesson`

## Remotion / three.js gotchas

- 2026-11-11 (e01): @remotion/three's ManualFrameRenderer advances WebGL in a passive `useEffect` that runs BEFORE child passive effects. Any per-frame imperative camera/geometry update must run in `useLayoutEffect`, or the first frame / stills render with the default camera.
- 2026-11-11 (e01): CSS `%` padding on AbsoluteFill resolves against WIDTH on the 1080×1920 canvas — position text with exact px values.
- 2026-11-11 (e01): `three` needs `@types/three` as a devDependency (no bundled types); errors cascade as `ExtendedColors` noise.
- 2026-11-11 (e01): `<perspectiveCamera makeDefault>` is not supported in this setup — set the default camera imperatively via `useThree` inside CameraRig.
- 2026-11-11 (e01): Per-frame buffer attribute updates (dust points): mutate the Float32Array in place + `needsUpdate = true`; do not recreate geometries.

## Visual / framing

- 2026-11-12 (Hybrid 3D+2D architecture): Procedural 3D cylinder/sphere stickmen in Three.js produce stiff, robotic, 1990s CAD-like characters (rated 2.5/10). The true aesthetic of viral shorts comes from clean, expressive 2D character silhouettes living within a deep 3D environment (Hybrid 3D+2D).
- 2026-11-12 (Storytelling & Direction): Avoid literal gym reps (pull-ups/push-ups) or repetitive mechanical loops (hamster wheels). Story acts must be deeply human, cinematic fables with emotional tension, sacrifice, and revelation.
- 2026-11-12 (Camera & Cutting): Dogmatic "zero hard cuts" flattens dramatic storytelling into detached surveillance footage. Motivated cuts and dramatic spotlights at character crisis/breakthrough points drive emotional resonance and visual pacing.
- 2026-11-12 (Contrast & Stylization): Anime-inspired silhouettes with sharp postures, dynamic flowing cloaks/scarves (cloth physics), and high-contrast color pops (crimson/amber) create instant visual punch against dark, volumetric 3D voids.
- 2026-11-11 (e01): Vertical 9:16 horizontal FOV is only ~±12–24° — background props (monoliths) must sit inside the camera's view band (|x| ≲ 12 at their depth) or they are invisible geometry.
- 2026-11-11 (e01): Fog blends everything to the bg color — distant props need a base color clearly lighter than bg (#1d1d28 vs #07070b) to read as silhouettes.
- 2026-11-11 (e01): A decelerating run cycle must freeze at a non-zero phase (0.3) or both legs merge into one column.
- 2026-11-11 (e01): Text blur-in can momentarily cover the subject mid-animation — place text in empty zones FIRST, animate second.
- 2026-11-11 (e01): Heavy font (Arial Black 900) reads as shouty and cheap; Segoe UI 600 reads clean. Text sizing must follow story hierarchy — the crucial line is the biggest.
- 2026-11-11 (e02): Making the pull-up bar thicker (r 0.035→0.055) + slightly metalized immediately fixes "bar looks like a hairline"; keep the geometry identical across all four panels so the comparison stays fair.
- 2026-11-11 (e02): Stickman readability at phone scale came from thicker limbs (~+15–20% radii) and slightly raising the darkest body tone; don't let the "dim the losers" palette push FAR_COLOR too close to the void before the dim curve even starts.
- 2026-11-11 (e02): Per-panel left-side HUD (name/verdict tag) was the least-readable text in "The Rep Report" — modest font increase (21→27, 24→28) plus a subtle text shadow fixed it without breaking layout or style.

## Structure / workflow

- 2026-11-11: A flat `src/` collapses at episode #2 — restructured to `app/src/shared` (engine) + `app/src/episodes/eNN-slug` (story), all episodes retained.
- 2026-11-11: Contact-sheet QA (tile 24 frames/sheet via ffmpeg) lets an agent inspect every frame without burning context on hundreds of full-res reads; zoom in full-res only where a sheet looks suspicious.

## CLI / environment (this machine)

- 2026-11-11 (e01): `npx remotion …` silently DROPS its arguments here (positionals never reach the CLI parser) — always run `node node_modules\\@remotion\\cli\\remotion-cli.js <cmd> …` from `app/`, or wrap it in an npm script. Applies to `render`, `still`, and `studio`.
- 2026-11-11 (e01): `node -e "…"` one-liners can lose or alter trailing arguments in this PowerShell — write a temp `.mjs` script file whenever arguments matter.
- 2026-11-11 (e01): Session-start READ-FIRST must verify the expected tree exists on disk, not just in notes: `app/src` vanished between sessions and had to be rebuilt from the recorded spec.
- 2026-11-11 (e01): 0.25–0.5× QA scale can alias 3D limbs into thin lines that look broken (the f310 hop read as "degenerate"); crop the full-res still before touching pose code — the body was fine.
- 2026-11-11 (e01): A tracking subject exits frame BEFORE its walk "ends" when the camera target lags behind it — e01's runner leaves frame-right ~f432 (foot last), just ahead of the ~f435 estimate. Time an exit from the off-axis angle vs half-hFOV, not walk distance ÷ speed.
- 2026-11-11 (e01): `--log=error` renders exit SILENTLY — never trust a finished render by its exit code alone. Verify with `ffprobe` (duration + file size) before deleting anything or building on top.
- 2026-11-11 (setup): Remotion's defaults are CPU-heavy — two config switches fix it: `setChromiumOpenGlRenderer('angle')` (WebGL rasterized on GPU) and `setHardwareAcceleration('if-possible')` (NVENC h264/h265 on Windows + NVIDIA; the bundled ffmpeg ships the encoders). NVENC is bitrate-controlled — CRF is rejected; ~8M at 1080p ≈ CRF-18 size.
- 2026-11-11 (e02): Remotion's `interpolate` THROWS on a non-strictly-monotonic inputRange (e.g. `[0, 8, 720, 720]`) — a shared component taking fixed fade keys crashes any episode that wants "no fade-out". FadeLayer now branches to a fade-in-only curve when `fadeOutStart >= totalFrames`. The error surfaced only in the rendered tab logs (`its-fine` wrapper), not at typecheck — render one QA frame early, don't batch-discover crashes at frame 720.
- 2026-11-11 (e02): A failed `--sequence` render leaves partial PNGs behind; delete `out/qa/seq` before re-running or stale frames pollute the contact sheets.
- 2026-11-11 (e02): The pull-up bars were hard to see because each panel's bar was a thin 3D rod rendered small in a 410px-tall band; thickening the rod (r 0.035→0.055) plus light metalness was the cheapest fix and kept the four-panel comparison fair.
- 2026-11-11 (e02): Left-side HUD legibility (panel name + verdict tag) is the main text problem in the stacked pull-up layout — the top strip/footer are not where viewers look for per-panel identity.
- 2026-11-11 (e02): Stickman silhouette read better after raising limb radii ~15–20% and lifting FAT_COLOR slightly off the void; do not let loser dim or palette changes turn the far limbs into near-invisible gray before the dim curve even starts.
- 2026-11-11 (e02): TEXT RULE compliance for this episode: hero line "REPS MAKE STRENGTH." is the biggest text (84px, amber, slam+glow); per-panel name/verdict are smaller but now legible (27/28px); the top strip thesis and CTA remain the secondary hierarchy; "REALITY LOOP" chip is modest (20px) but not buried.
