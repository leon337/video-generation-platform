# Cloud Remotion + Kokoro Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render MCF Web Intelligence video 06 as a free cloud artifact using Kokoro PT-BR + Remotion on GitHub Actions, with no local notebook rendering.

**Architecture:** Add an isolated `apps/shorts-renderer` workspace app. A Python Kokoro script generates one WAV per scene; a TypeScript preparation step validates the video spec, measures WAV duration with ffprobe, and writes resolved render props. Remotion renders deterministic Signal-style scenes, while a manual GitHub Actions workflow owns dependency setup, render, media QA, and artifact upload.

**Tech Stack:** Node.js 24, pnpm 11, TypeScript, React, Remotion 4.0.506, Vitest, Python 3.12, Kokoro 0.9.4, espeak-ng, ffmpeg/ffprobe, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-16-cloud-remotion-kokoro-pilot-design.md`

## Global Constraints

- No paid provider or paid API is required for the pilot.
- No video rendering on the user's notebook.
- Output is vertical MP4 H.264 + AAC: draft 720x1280 or final 1080x1920.
- Language is PT-BR and no presenter/avatar is visible.
- `espeak-ng` may support Kokoro phonemization but must never be the final voice engine.
- Workflow is manual `workflow_dispatch` during the pilot.
- Existing provider-domain architecture remains unchanged.

---

### Task 1: Spec contract and template routing

**Files:**
- Create: `apps/shorts-renderer/package.json`
- Create: `apps/shorts-renderer/tsconfig.json`
- Create: `apps/shorts-renderer/src/spec.ts`
- Create: `apps/shorts-renderer/src/spec.test.ts`
- Create: `apps/shorts-renderer/specs/06-gpt-firecrawl-router.json`

**Interfaces:**
- Produces: `parseVideoSpec(input: unknown): VideoSpec`
- Produces: `resolveTemplate(template: VideoTemplate): "flow" | "explainer" | "compare"`

- [ ] **Step 1: Write failing tests** covering valid flow specs, empty scenes, invalid template, and missing narration.
- [ ] **Step 2: Run** `pnpm --filter @vgp/shorts-renderer test` and verify failure before implementation.
- [ ] **Step 3: Implement** typed validation with explicit error messages and no external schema dependency.
- [ ] **Step 4: Add video 06 spec** with six scenes and the approved GPT/Firecrawl routing narration.
- [ ] **Step 5: Run test + typecheck** and commit `feat(renderer): add short video spec contract`.

### Task 2: Kokoro scene narration and timing preparation

**Files:**
- Create: `apps/shorts-renderer/scripts/generate_narration.py`
- Create: `apps/shorts-renderer/src/prepare-render.ts`
- Create: `apps/shorts-renderer/src/prepare-render.test.ts`

**Interfaces:**
- Python CLI: `generate_narration.py --spec <json> --voice <id> --out <dir>`
- Produces: `public/generated/<video-id>/scene-NN.wav`
- TypeScript CLI: `prepare-render.ts --spec <json> --audio-dir <dir> --quality <draft|final> --out <json>`
- Produces resolved props with `fps`, `width`, `height`, `durationInFrames`, and per-scene `from`, `durationInFrames`, `audioFile`.

- [ ] **Step 1: Write failing timing tests** using an injected duration reader so tests need no real ffprobe process.
- [ ] **Step 2: Implement duration-to-frame conversion** at 30 fps with a minimum 12-frame visual tail per scene.
- [ ] **Step 3: Implement Kokoro CLI wrapper** using language code `p`, WAV output at 24 kHz, and voice argument validation limited to `pf_dora`, `pm_alex`, `pm_santa` for the pilot.
- [ ] **Step 4: Run tests/typecheck** and commit `feat(renderer): add Kokoro narration preparation`.

### Task 3: Deterministic Signal Remotion composition

**Files:**
- Create: `apps/shorts-renderer/src/index.ts`
- Create: `apps/shorts-renderer/src/Root.tsx`
- Create: `apps/shorts-renderer/src/ShortVideo.tsx`
- Create: `apps/shorts-renderer/src/components/SignalFrame.tsx`
- Create: `apps/shorts-renderer/src/components/FlowScene.tsx`
- Create: `apps/shorts-renderer/src/components/ExplainerScene.tsx`
- Create: `apps/shorts-renderer/src/components/CompareScene.tsx`
- Create: `apps/shorts-renderer/src/render.test.ts`

**Interfaces:**
- Composition id: `MCFShort`
- Input props: resolved props from Task 2
- Scene components receive one resolved scene and render only deterministic React/Remotion markup.

- [ ] **Step 1: Write smoke tests** for template routing and required Signal colors/text labels.
- [ ] **Step 2: Implement `SignalFrame`** with background `#1C2644`, main text `#E2DCD0`, accent `#C8A870`, border `#2E3D5C`, secondary text `#8A96A8`.
- [ ] **Step 3: Implement flow/explainer/compare layouts** using cards, arrows, nodes and large mobile typography only.
- [ ] **Step 4: Animate exclusively through Remotion frame APIs** (`useCurrentFrame`, `interpolate`, `spring`); no CSS animation/transition.
- [ ] **Step 5: Attach each scene WAV with `Sequence` + `Audio` and run tests/typecheck**; commit `feat(renderer): add Signal short composition`.

### Task 4: Cloud render workflow and media QA

**Files:**
- Create: `.github/workflows/render-short.yml`
- Create: `apps/shorts-renderer/scripts/validate_media.mjs`
- Create: `apps/shorts-renderer/scripts/voice_bakeoff.py`

**Interfaces:**
- Workflow inputs: `spec_path`, `quality`, `voice`.
- Artifact names: `short-<id>-<quality>` and `voice-bakeoff-ptbr`.

- [ ] **Step 1: Add manual workflow** using checkout, pnpm 11.23.0, Node 24, Python 3.12, apt `ffmpeg espeak-ng`, and pip `kokoro==0.9.4 soundfile`.
- [ ] **Step 2: Generate PT-BR voice samples** for `pf_dora`, `pm_alex`, `pm_santa` from one fixed technical phrase and upload them as an artifact.
- [ ] **Step 3: Generate narration + resolved props**, run `npx remotion render MCFShort` with props file and selected draft/final dimensions.
- [ ] **Step 4: Generate thumbnail** with Remotion still or ffmpeg and run `validate_media.mjs` against ffprobe JSON.
- [ ] **Step 5: Upload MP4, thumbnail, resolved props and render report even on QA diagnosis paths where files exist.**
- [ ] **Step 6: Commit** `ci(renderer): add free cloud short render workflow`.

### Task 5: Verify pilot and document handoff

**Files:**
- Modify: `README.md`
- Create: `docs/rendering/cloud-short-renderer.md`

**Interfaces:**
- Human entry point: GitHub Actions `Render MCF Short` workflow.
- Downstream consumer: existing MCF YouTube publisher/helper receives the downloaded MP4 and thumbnail.

- [ ] **Step 1: Run repository verification** (`pnpm install --no-frozen-lockfile`, format, lint, typecheck, test, build) in CI.
- [ ] **Step 2: Dispatch draft render** for `apps/shorts-renderer/specs/06-gpt-firecrawl-router.json` with provisional voice `pf_dora`.
- [ ] **Step 3: Confirm workflow media QA** reports H.264, AAC, 720x1280 and non-zero duration.
- [ ] **Step 4: Download/inspect artifacts without rendering locally** and record workflow run/artifact identifiers in handoff docs.
- [ ] **Step 5: Update README/docs** with exact trigger, artifacts, voice override and failure recovery procedure.
- [ ] **Step 6: Commit** `docs(renderer): document cloud short pipeline`.

## Self-review

- Spec coverage: all constraints, voice bake-off, deterministic visuals, media QA, manual dispatch and YouTube separation are mapped to tasks.
- Placeholder scan: no TBD/TODO/future implementation placeholders.
- Interface consistency: Task 2 resolved props are the sole render input consumed by Task 3 and validated/uploaded by Task 4.
- Scope: one pilot renderer only; automatic YouTube publishing and backlog rendering remain out of scope.
