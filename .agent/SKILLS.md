# SKILLS — recurring workflows, step by step

## Episode lifecycle (start to hand-off)

1. Read `.agent/RULES.md` + top of `.agent/IMPROVEMENTS.md`.
2. **Type + story brief first**: pick the video type from `.agent/TYPES.md` together with the user (rule 2), then the story brief: unique topic, curiosity hook, payoff flip. Get the user's OK on type + brief BEFORE writing code (no assumptions).
3. Copy `app/src/episodes/_template` → `app/src/episodes/eNN-slug`; register it in `app/src/Root.tsx`.
4. Build order: `timeline.ts` (beats + speed profile) → `camera.ts` (continuous keyframes on the shared CR path) → scene components → `text-beats.tsx`.
5. Run the QA frame sweep (below). Fix → re-sweep.
6. Hand off: "preview ready at localhost:3000" + QA report + list of every decision made. WAIT for approval.
7. After approval the user decides on render. After any approved render, delete temp stills. Then update `.agent/LESSONS.md` + `.agent/IMPROVEMENTS.md`.

## QA frame sweep (mandatory before every hand-off)

- Render all frames as low-res stills in one pass (run inside `app/`; `out/` lives at project root):
  `node node_modules\@remotion\cli\remotion-cli.js render src/index.ts <id> ../out/qa/seq --sequence --image-format=png --scale=0.25 --log=error`
  → files are `element-000.png` … `element-(N-1).png`, 0-based (verify the naming after the run).
- Tile into contact sheets (6×4 = 24 frames each):
  `ffmpeg -y -v error -framerate 2 -start_number 0 -i "../out/qa/seq/element-%03d.png" -vf "tile=6x4" -frames:v <ceil(N/24)> "../out/qa/sheet%02d.png"`
- NEVER invoke the CLI as `npx remotion …` — it silently drops arguments in this environment. Use the `node node_modules\@remotion\cli\remotion-cli.js` form or an npm script.
- Read EVERY sheet. Adjacent-frame check = camera continuity (rule 5: zero cuts).
- Full-res spot checks at every text beat in/out, camera direction change, stop/hop/walk start, and the first/last 5 frames:
  `node node_modules\@remotion\cli\remotion-cli.js still src/index.ts <id> ../out/qa/spot/fNNN.png --frame N --scale=0.5` (`--scale=1` for hero slam / first / last).
- If anything looks wrong at sheet/spot scale, crop into the still with ffmpeg (`-vf "crop=w:h:x:y"`) BEFORE changing code — low-res can fake defects (limbs aliasing into thin lines, edge subjects shrinking to nothing).
- Checklist: composition framing · subject not covered by text · camera continuity · gait/pose sanity · dust/sweat/monoliths/wobble visible but subtle · mood-dim timing · text hierarchy (hero line biggest) · fades in/out · brand mark present every frame · audio plan (state "no track yet" if empty).

## Reference analysis (when new reference videos arrive)

1. Save to `references/vN_name.mp4`.
2. `ffprobe` duration/fps/size; `ffmpeg select='gt(scene,0.04)'` for a first change-detection pass.
3. For references worth learning from (especially high view counts): extract EVERY frame to `references/frames/<name>/`, tile into contact sheets (20 frames/sheet, 5×4), read every sheet, full-res crops for anything ambiguous. 2 fps sampling is NOT acceptable for high-value references.
4. Write conclusions into `references/ANALYSIS.md`; register any newly discovered video type in `.agent/TYPES.md`.

## Music retime (when a licensed track arrives)

1. Drop the file at `app/public/audio/eNN-slug.mp3`.
2. Uncomment the `<Audio>` line in the episode composition.
3. Derive BPM → beat frames → shift `T.*` starts so text/beat land on beats (keep durations; move starts).
4. Full QA sweep again (sync is a visual+audio beat change).

## Render (gated — rule 3)

- ONLY after explicit approval — and ALWAYS both resolutions (rule 11), run inside `app/`:
  - 1080: `node node_modules\@remotion\cli\remotion-cli.js render src/index.ts <id> ../out/<id>-1080.mp4 --video-bitrate=8M --log=error`
  - 4K:   `node node_modules\@remotion\cli\remotion-cli.js render src/index.ts <id> ../out/<id>-4k.mp4 --scale=2 --video-bitrate=24M --log=error`
- GPU (rule 12): ANGLE + NVENC come from `remotion.config.ts`. After a config change, run one render with `--log=verbose` once and confirm the encoder line says `hardware accelerated: true`.
- Spot-check one extracted frame from EACH file (`ffmpeg -ss <t> -i <file> -frames:v 1 out.png`) to confirm both are clean before deleting anything.
- Then DELETE `out/qa/` temp stills and sheets.
