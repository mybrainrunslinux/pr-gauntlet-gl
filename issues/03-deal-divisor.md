# Issue #03: deal-divisor

**Difficulty:** Tier 1 (Clear)
**File(s):** `app/index.html`
**Type:** Wrong fan-arc divisor — cards overlap

## Description

When dealing cards into a fan layout, each card's angular offset is computed as `i / n` instead of `i / (n - 1)`. This means the last card never reaches the full arc end — all cards are compressed into a smaller arc and heavily overlap each other instead of spreading evenly.

## Reproduction

Deal 5+ cards. All cards are stacked near the start of the arc, with the last card not reaching the intended far edge.

## Expected Behavior

Cards spread evenly across the full fan arc, first card at one end, last card at the other.

## Actual Behavior

Cards are compressed — they don't spread to the full arc. Increasing card count makes overlap worse.
