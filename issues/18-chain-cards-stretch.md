# Issue #18: chain-cards-stretch

**Difficulty:** Tier 4 (Chain)
**File(s):** `app/index.html`
**Type:** Cards visually distorted after resize

## Description

After resizing the browser window, all cards in the scene appear stretched along one axis. The card aspect ratio (portrait orientation) no longer matches what was rendered before the resize — cards look like wide rectangles or tall slivers depending on the resize direction.

## Reproduction

1. Open `index.html` — cards look correct
2. Resize the window horizontally
3. Observe: cards stretch/squash to fill the wrong aspect ratio

## Expected Behavior

Cards maintain their correct aspect ratio at all window sizes.

## Actual Behavior

Card rendering is distorted after resize — the GPU projection matrix still encodes the old aspect ratio.

## Chain Note

This issue shares a root cause with issues #16–20. Fix the root once and all five resolve.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "chain-cards-stretch" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
