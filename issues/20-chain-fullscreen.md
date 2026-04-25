# Issue #20: chain-fullscreen

**Difficulty:** Tier 4 (Chain)
**File(s):** `app/index.html`
**Type:** Fullscreen transition breaks projection

## Description

Entering fullscreen mode (F11 or the fullscreen button) triggers a `resize` event. Because `camera.updateProjectionMatrix()` is never called, the transition to fullscreen leaves the scene with a completely wrong aspect ratio — typically severely letterboxed or pillarboxed.

## Reproduction

1. Open `index.html` in a normal window
2. Press F11 to go fullscreen
3. Observe: scene is severely stretched or cropped

## Expected Behavior

Fullscreen transition recomputes camera aspect and projection — scene fills the screen correctly.

## Actual Behavior

Scene renders with the windowed aspect ratio in fullscreen — severe distortion.

## Chain Note

This issue shares a root cause with issues #16–20. Fix the root once and all five resolve.
