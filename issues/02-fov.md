# Issue #02: fov

**Difficulty:** Tier 1 (Clear)
**File(s):** `app/index.html`
**Type:** Extreme field-of-view distortion

## Description

The perspective camera's field of view is set to `120` degrees instead of a normal value like `60`. Cards appear severely distorted — bulging at the edges, with extreme fisheye perspective. The illusion is broken and the layout looks wrong.

## Reproduction

Open `index.html`. Cards appear as heavily distorted trapezoidal shapes, especially near the edges of the canvas.

## Expected Behavior

Cards render with natural perspective at FOV ≈ 60°.

## Actual Behavior

120° FOV causes extreme barrel distortion — cards at the edges are nearly unrecognizable.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "fov" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
