# Issue #15: resize-aspect

**Difficulty:** Tier 3 (Vague)
**File(s):** `app/index.html`
**Type:** Camera projection matrix not updated on resize

## Description

The `onResize` handler updates `renderer.setSize` but does not update `camera.aspect` or call `camera.updateProjectionMatrix()`. After resizing the window, the camera's projection matrix is stale — the scene is rendered with the wrong aspect ratio (stretched or squished horizontally).

## Reproduction

Open `index.html`, resize the browser window, then observe the cards. They appear stretched or squeezed depending on whether the window was made wider or narrower.

## Expected Behavior

On resize: `camera.aspect = newWidth / newHeight; camera.updateProjectionMatrix();` is called so perspective rendering stays correct.

## Actual Behavior

Renderer dimensions update but camera projection does not — cards distort after any resize.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "resize-aspect" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
