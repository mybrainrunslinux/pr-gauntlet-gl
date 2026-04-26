# Issue #11: fan-arc

**Difficulty:** Tier 3 (Vague)
**File(s):** `app/index.html`
**Type:** Full-circle arc instead of partial arc

## Description

`FAN_ARC` is set to `Math.PI * 2.0` (360°) instead of a comfortable spread like `Math.PI * 0.6` (108°). Cards are distributed around a full circle, wrapping behind the scene and overlapping with each other at the back — the "fan" hand looks like a ring, not a hand of cards.

## Reproduction

Deal 5+ cards. Cards form a complete ring instead of a comfortable hand-spread arc. Cards at the "back" of the ring are behind the camera and invisible.

## Expected Behavior

Cards spread in a natural partial arc (roughly 100–120°), like a hand of playing cards.

## Actual Behavior

Cards spread 360° — some are behind the camera, and the layout resembles a clock face not a hand.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "fan-arc" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
