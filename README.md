# PR-Gauntlet · WebGL Edition

A benchmark for coding agents, bots, and autonomous development stacks — **v3: Three.js/WebGL**.

**20 crafted GitHub Issues** on a real Three.js 3D application, ranging from crystal-clear one-liners to deeply interdependent rendering bugs that require tracing a root cause across the scene graph.

Part of the PR-Gauntlet series:
- [PR-Gauntlet v1](https://github.com/mybrainrunslinux/pr-gauntlet) — TypeScript/React (20 issues)
- [PR-Gauntlet v2](https://github.com/mybrainrunslinux/pr-gauntlet-py) — Python/FastAPI (20 issues)
- **[PR-Gauntlet v3](https://github.com/mybrainrunslinux/pr-gauntlet-gl) — Three.js/WebGL (this repo)**

## How It Works

```
┌─────────────┐    ┌────────────────┐    ┌─────────────────┐
│  v0-clean   │───▶│  v1-bugged     │───▶│  your-bot-branch│
│  (passes    │    │  (20 bugs      │    │  (agent fixes   │
│   all tests)│    │   introduced)  │    │   the issues)   │
└─────────────┘    └────────────────┘    └─────────────────┘
                         diff ▲                diff ▲
                    shows what was         shows what agent
                    broken                    changed
```

Fork the repo, point your agent at `v1-bugged`, and let it work through the issues. Run the scorer to see how many it fixed — and diff against `v0-clean` to see *how* it fixed them.

## Scoring

```bash
git clone https://github.com/mybrainrunslinux/pr-gauntlet-gl
cd pr-gauntlet-gl
git checkout v1-bugged

npm install playwright @playwright/test --save-dev
npx playwright install chromium

# All 20 issues (serves app automatically on :8002)
npx playwright test scoring/ --config scoring/playwright.config.js

# Single issue
npx playwright test scoring/ --config scoring/playwright.config.js --grep "ambient-light"

# JSON results
npx playwright test scoring/ --config scoring/playwright.config.js --reporter=json > results.json
```

No build step. App is a single `index.html` — served directly by the Playwright config.

## Issue Tiers

| Tier | Issues | Difficulty |
|------|--------|------------|
| 1 — Clear | 1–5 | Obvious value off, obvious fix |
| 2 — Moderate | 6–10 | Requires understanding Three.js lifecycle and disposal |
| 3 — Vague | 11–15 | Symptoms visible at runtime; root cause in geometry/math |
| 4 — Chain | 16–20 | Issues share a root cause — fix the source, side-effects resolve |

### Issue Index

| # | Name | Description |
|---|------|-------------|
| 01 | ambient-light | AmbientLight intensity is 0.0 — scene is black |
| 02 | fov | Camera FOV is 120° — extreme fisheye distortion |
| 03 | deal-divisor | Card spacing divisor is 0 → division by zero on deal |
| 04 | pixel-ratio | Renderer pixel ratio hardcoded to 1 — blurry on HiDPI |
| 05 | raycaster-dpr | Raycaster ignores device pixel ratio — click targets offset |
| 06 | texture-dispose | Textures never disposed — VRAM leak on repeated deals |
| 07 | backside | Card back-face culled — cards invisible from behind |
| 08 | lerp-dt | Animation lerp factor ignores delta-time — framerate-dependent speed |
| 09 | reveal-scale | Reveal animation target scale is 0.01 — card shrinks to invisible |
| 10 | damping | OrbitControls damping disabled — camera snaps without inertia |
| 11 | fan-arc | Fan spread is 2π — cards stacked in full circle instead of arc |
| 12 | card-z-start | Cards start at index×2.0 z-offset — visible z-fighting |
| 13 | lerp-speed | Base lerp speed too slow (0.004) — animation visibly stutters |
| 14 | lerpspeed-hover | Hover lerp speed same as base — no responsive feel on hover |
| 15 | resize-aspect | Resize handler updates size but not camera aspect ratio |
| 16 | chain-projection | All 5 chain issues share a root cause in the resize handler |
| 17 | chain-raycaster-resize | ↑ Resize updates renderer but never calls `camera.updateProjectionMatrix()` |
| 18 | chain-cards-stretch | ↑ Fix the projection matrix call to resolve all five |
| 19 | chain-perspective | ↑ |
| 20 | chain-fullscreen | ↑ |

### The Chain (Issues 16–20)

Issues 16–20 are not independent. They share a single root cause in the window resize handler. An agent that patches each rendering artifact in isolation will not fully resolve any of them. An agent that finds the missing `camera.updateProjectionMatrix()` call will resolve all five as a side effect.

This is the benchmark's hardest test: does the agent understand *why* or just *what*?

## Setup

```bash
git clone https://github.com/mybrainrunslinux/pr-gauntlet-gl
cd pr-gauntlet-gl
git checkout v1-bugged

# Serve the app
npx --yes serve app -p 8002 -s

# In another terminal — run scorer
npx playwright test scoring/ --config scoring/playwright.config.js --reporter=list
```

Node 18+ required. No build step, no API keys, no Docker required.

## The App: MindBend

A 3D card-dealing experience — Three.js, WebGL, OrbitControls, device-pixel-ratio-aware raycasting, GSAP-style lerp animations. Cards fan out in 3D space, respond to hover and click, reveal on selection. Enough surface area to hide real rendering and math bugs; visual enough to make them obvious when present.

See [issues/](./issues/) for all 20 issue descriptions.

## Multi-Language Series

| Repo | Language | App | Status |
|------|----------|-----|--------|
| [pr-gauntlet](https://github.com/mybrainrunslinux/pr-gauntlet) | TypeScript / React | TaskFlow (kanban) | ✅ live |
| [pr-gauntlet-py](https://github.com/mybrainrunslinux/pr-gauntlet-py) | Python / FastAPI | FlowForge (workflows) | ✅ live |
| [pr-gauntlet-gl](https://github.com/mybrainrunslinux/pr-gauntlet-gl) | Three.js / WebGL | MindBend (3D cards) | ✅ live |

The chain primitive is language-specific (React stale closures → SQLAlchemy flush/commit → WebGL projection matrix) but the scoring methodology is identical across all three.

## Continuous Competition

- Fork → branch named `your-agent/attempt-N`
- Submit a PR against `v1-bugged`
- CI runs the scorer and posts results as a PR comment
- Diff vs `v0-clean` is visible in the PR for human review

## License

MIT. Benchmark dataset (issue descriptions + test files) is CC-BY-4.0.
