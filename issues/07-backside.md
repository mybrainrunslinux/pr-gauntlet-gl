# Issue #07: backside

**Difficulty:** Tier 2 (Moderate)
**File(s):** `app/index.html`
**Type:** Wrong face culling — card back invisible

## Description

The back face material uses `THREE.BackSide` instead of `THREE.FrontSide`. When a card flips to reveal its back, the back face is culled (invisible) and only the front face shows through — the flip animation appears to show the front face on both sides.

## Reproduction

Trigger a card flip animation. As the card rotates past 90°, instead of seeing the card back texture, the card appears transparent or the front face bleeds through.

## Expected Behavior

Card flip reveals the back face with its distinct texture/design.

## Actual Behavior

The back face is invisible due to incorrect face culling direction.
