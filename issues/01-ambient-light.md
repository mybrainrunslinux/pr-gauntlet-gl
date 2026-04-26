# Issue #01: ambient-light

**Difficulty:** Tier 1 (Clear)
**File(s):** `app/index.html`
**Type:** Zero-intensity light — scene is black

## Description

The `AmbientLight` is created with intensity `0.0` instead of a positive value (e.g. `0.6`). The scene renders as a solid black rectangle — no cards, no environment, nothing visible.

## Reproduction

Open `index.html` in a browser. The canvas is completely black.

## Expected Behavior

Cards are visible under ambient illumination. The scene has a warm, atmospheric glow.

## Actual Behavior

The canvas renders black — no light reaches any geometry.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "ambient-light" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
