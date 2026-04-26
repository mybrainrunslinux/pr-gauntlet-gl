# Issue #09: reveal-scale

**Difficulty:** Tier 2 (Moderate)
**File(s):** `app/index.html`
**Type:** Near-zero reveal scale — card disappears

## Description

When a card is "revealed" (selected, flipped face-up), the target scale is set to `0.01` instead of a visible value like `1.2`. The card shrinks to near-invisible during the reveal animation rather than growing to draw attention.

## Reproduction

Click a card to reveal it. The card shrinks to a nearly invisible dot rather than scaling up with a dramatic reveal effect.

## Expected Behavior

The reveal animation scales the card up (e.g., to `1.2×`) to emphasize the reveal.

## Actual Behavior

Card scales down to `0.01×` — effectively disappears during reveal.

## Steps to Fix

1. Read `app/index.html` and understand the bug described above.
2. Apply the minimal fix — only edit `app/index.html`.
3. Validate: `npx playwright test scoring/test_issues.spec.js --grep "reveal-scale" --config scoring/playwright.config.js`
4. Confirm the test passes before submitting.
