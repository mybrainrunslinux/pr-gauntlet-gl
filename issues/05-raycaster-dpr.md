# Issue #05: raycaster-dpr

**Difficulty:** Tier 1 (Clear)
**File(s):** `app/index.html`
**Type:** Missing devicePixelRatio correction in raycaster

## Description

The raycaster's NDC coordinates are computed from raw `clientX/clientY` without accounting for `devicePixelRatio`. On HiDPI displays the NDC values are off by a factor of DPR, causing click/hover detection to be misaligned — clicks register on the wrong card or miss entirely.

## Reproduction

On a display with `window.devicePixelRatio > 1`, click a card. The hover highlight and selection activate on a different card than the one clicked.

## Expected Behavior

Mouse NDC coordinates correctly map to the rendered pixel position regardless of DPR.

## Actual Behavior

Click target is offset by a factor of DPR — selection is inaccurate on HiDPI displays.
