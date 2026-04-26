# Issue #17: chain-raycaster-resize

**Difficulty:** Tier 4 (Chain)
**File(s):** `app/index.html`
**Type:** Raycaster mis-fires after resize

## Description

After a window resize, click and hover detection is offset from the actual rendered card positions. Hovering over a card highlights the wrong one; clicking selects nothing even when clicking directly on a card.

## Reproduction

1. Open `index.html` in a wide window
2. Verify hover/click works correctly
3. Resize the window to a different aspect ratio
4. Hover over cards — highlights appear on wrong cards or not at all

## Expected Behavior

Raycaster NDC coordinates remain accurate regardless of window size.

## Actual Behavior

After resize, the stale projection matrix causes raycaster ray directions to be wrong — hit testing fails.

## Chain Note

This issue shares a root cause with issues #16–20. Fix the root once and all five resolve.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "chain-raycaster-resize" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
