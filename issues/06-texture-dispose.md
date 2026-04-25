# Issue #06: texture-dispose

**Difficulty:** Tier 2 (Moderate)
**File(s):** `app/index.html`
**Type:** GPU memory leak — textures not disposed

## Description

`disposeCard()` calls `child.geometry.dispose()` and `child.material.dispose()` but never calls `child.material.map.dispose()`. The texture remains in GPU memory indefinitely. In a long session with many card deals/discards, GPU VRAM fills up and performance degrades — on some hardware, the WebGL context is eventually lost.

## Reproduction

Use browser DevTools → Memory → GPU to observe. Deal and discard cards repeatedly. GPU texture memory grows without bound.

## Expected Behavior

`disposeCard()` also calls `child.material.map.dispose()` (and `child.material.backMap.dispose()` if present).

## Actual Behavior

Only geometry and material objects are disposed; textures remain in GPU memory indefinitely.
