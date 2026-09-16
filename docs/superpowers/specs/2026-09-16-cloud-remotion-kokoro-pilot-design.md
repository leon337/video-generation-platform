# Cloud Remotion + Kokoro Pilot Design

## Purpose

Build a free cloud-first rendering path for the MCF Web Intelligence short-video series, replacing HeyGen as the default renderer while preserving comparable educational quality and avoiding heavy CPU/RAM use on Leandro's notebook.

## Approved direction

Use the existing public repository `leon337/video-generation-platform` as the execution platform. Render on GitHub-hosted Actions runners. Use Remotion for deterministic 9:16 motion graphics and Kokoro for neural PT-BR narration. Keep YouTube publishing outside this renderer and continue using the existing authenticated publisher/helper after artifacts are produced.

## Constraints

- No paid provider or paid API is required for the pilot.
- No video rendering on the user's notebook.
- Notebook may only perform light orchestration, artifact download, QA, and YouTube upload when necessary.
- Output format: MP4, H.264 + AAC, 1080x1920 final; 720x1280 draft is allowed for fast QA.
- Language: PT-BR.
- No visible presenter or avatar.
- Narration must sound neural and natural; `espeak-ng` is forbidden for final output.
- The workflow must be manual (`workflow_dispatch`) during the pilot to avoid accidental Action consumption.
- Existing platform provider boundaries must remain intact; this is an additive render engine, not a rewrite of I0.

## Visual system

Use the MCF `Signal` visual grammar already adopted for the series:

- Background: `#1C2644`
- Main text: `#E2DCD0`
- Accent: `#C8A870`
- Border: `#2E3D5C`
- Secondary text: `#8A96A8`
- Large mobile-first typography
- Maximum six scenes for standard Shorts
- Reuse cards, arrows, nodes, labels, simple icons, and flow diagrams
- Avoid generative illustration work unless explicitly requested

## Runtime architecture

Add an isolated app at `apps/shorts-renderer`.

The renderer consumes a JSON video specification and produces:

1. PT-BR narration audio via Kokoro.
2. A scene timing manifest derived from narration duration and scene weights.
3. A deterministic Remotion composition.
4. MP4 output plus a thumbnail frame.
5. A small render report containing resolution, duration, codec expectations, template id, and voice id.

The GitHub Actions workflow installs Node/Python dependencies, generates narration, renders the composition, validates the MP4 with ffprobe, and uploads the MP4/thumbnail/report as workflow artifacts.

## Input contract

Each job uses one JSON spec with:

- `id`
- `title`
- `template`: `flow`, `explainer`, or `compare`
- `voice`
- `resolution`: `draft` or `final`
- `scenes[]`
  - `title`
  - optional `subtitle`
  - optional `points[]`
  - `narration`
  - optional `kind`

The pilot spec is video 06: `Agente GPT + Firecrawl com roteamento automático` using template `flow`.

## Voice strategy

Primary engine: Kokoro with a PT-BR-compatible voice selected by a voice bake-off. The pilot must generate short samples for at least three available PT-BR voice candidates before selecting the default voice.

Selection criteria:

- natural cadence in Brazilian Portuguese
- clear pronunciation of technical terms
- no metallic or robotic artifacts
- intelligibility on mobile speakers
- acceptable generation speed on GitHub-hosted Linux runner

The selected voice id is recorded in the render report and can be overridden per spec.

## GitHub Actions workflow

Create `.github/workflows/render-short.yml` with `workflow_dispatch` inputs:

- `spec_path` defaulting to the pilot spec
- `quality` with `draft` or `final`
- `voice` optional override

The workflow must not publish to YouTube. It only produces artifacts. Publishing stays behind the existing human-controlled authenticated helper.

## Failure handling

Fail the job if:

- spec validation fails
- narration file is empty
- Remotion render exits non-zero
- ffprobe does not detect H.264 video and AAC audio
- output dimensions do not match selected quality
- duration is zero or unreasonable for the spec

Always upload logs/report when possible so another agent can diagnose without rerunning locally.

## Testing

Unit-test spec validation and template routing. Add a lightweight composition smoke test that can run without rendering the full final video. The workflow validates the actual rendered artifact with ffprobe.

The existing repository CI must remain green. The render workflow is separate and manually triggered.

## Pilot success criteria

The pilot is accepted when:

1. GitHub Actions renders video 06 without using the notebook for rendering.
2. A natural PT-BR Kokoro voice is selected and recorded.
3. Output is vertical and visually follows Signal.
4. MP4 passes codec/resolution/duration validation.
5. The artifact is downloadable from the workflow run and ready for the existing YouTube publication flow.
6. The implementation is reusable for videos 01-05 and 09 by changing only the JSON spec/template inputs.

## Out of scope for this pilot

- Automatic YouTube publishing from GitHub Actions
- Paid TTS/video providers
- Avatar generation
- LLM-generated artwork per scene
- Replacing the platform's existing provider-domain architecture
- Rendering the full backlog before the pilot output is reviewed
