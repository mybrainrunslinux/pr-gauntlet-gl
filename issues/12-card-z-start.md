# Issue #12: card-z-start

**Difficulty:** Tier 3 (Vague)
**File(s):** `app/index.html`
**Type:** Cards spawn too far apart in Z — deal animation wrong

## Description

New cards initialize their Z position as `index * 2.0` instead of starting from a deck position (e.g., `0`). Each card in a deal starts 2 units further from the camera than the last. On a 10-card deal, cards are spread 0–18 units in Z before the animation even begins, making the deal look like cards flying in from random depths rather than emerging from a single deck.

## Reproduction

Deal multiple cards quickly. Each successive card appears further back in Z-depth before animating to its fan position — no sense of a unified deck origin.

## Expected Behavior

All cards start at the same deck position (Z ≈ 0) and animate out to their fan positions.

## Actual Behavior

Cards initialize at `index * 2.0` Z offsets — they appear to fly in from different depths, breaking the illusion of a deck.
