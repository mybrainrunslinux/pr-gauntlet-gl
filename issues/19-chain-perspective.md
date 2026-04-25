# Issue #19: chain-perspective

**Difficulty:** Tier 4 (Chain)
**File(s):** `app/index.html`
**Type:** Perspective depth incorrect after resize

## Description

After a resize, the apparent depth and size of cards in the 3D scene changes unexpectedly. Cards that were at a comfortable viewing distance now appear either too close (oversized) or too far (tiny), because the field-of-view frustum is not recalculated when the aspect ratio changes.

## Reproduction

Deal a hand of cards at default window size. Note the card sizes and apparent depth. Resize window significantly. Cards appear at wrong scale relative to the scene.

## Expected Behavior

Card apparent size and depth perception remain consistent across window sizes.

## Actual Behavior

After resize, the stale projection matrix produces wrong perspective depth — cards look wrong sized.

## Chain Note

This issue shares a root cause with issues #16–20. Fix the root once and all five resolve.
