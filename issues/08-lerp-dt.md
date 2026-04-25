# Issue #08: lerp-dt

**Difficulty:** Tier 2 (Moderate)
**File(s):** `app/index.html`
**Type:** Frame-rate-dependent animation

## Description

Card position/rotation interpolation uses a fixed `lerpSpeed` constant rather than `lerpSpeed * deltaTime`. On a 144Hz display, cards animate 2.4× faster than on 60Hz; on a slow device, animations are sluggish. The experience is inconsistent across hardware.

## Reproduction

Open `index.html` on a 144Hz display vs. a 60Hz display. Card deal/flip/hover animations are noticeably faster/slower between the two.

## Expected Behavior

`lerp(current, target, lerpSpeed * delta)` — animation speed is consistent across all frame rates.

## Actual Behavior

`lerp(current, target, lerpSpeed)` — animation speed scales with frame rate.
