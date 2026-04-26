# Issue #16: chain-projection

**Difficulty:** Tier 4 (Chain — root cause)
**File(s):** `app/index.html`
**Type:** Missing camera.updateProjectionMatrix() after resize

## Description

The `onResize` handler sets `camera.aspect` and calls `renderer.setSize()` but never calls `camera.updateProjectionMatrix()`. Without this call, the GPU projection matrix is frozen at its initial state — the scene is rendered with the original aspect ratio regardless of window size.

## Reproduction

```javascript
// In browser console:
window.dispatchEvent(new Event('resize'));
// Resize the window to landscape
// Cards appear vertically stretched — projection matrix is stale
```

## Expected Behavior

After `camera.aspect` is updated, `camera.updateProjectionMatrix()` propagates the change to the GPU.

## Actual Behavior

`aspect` is updated in JS but the GPU never receives the new projection — all post-resize rendering is distorted.

## Chain Note

This issue shares a root cause with issues #16–20. Calling `camera.updateProjectionMatrix()` in `onResize` resolves all five.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "chain-projection" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
