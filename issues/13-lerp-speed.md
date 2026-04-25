# Issue #13: lerp-speed

**Difficulty:** Tier 3 (Vague)
**File(s):** `app/index.html`
**Type:** Lerp speed too slow — animations feel sluggish

## Description

`lerpSpeed` is set to `0.04` instead of a snappier value like `0.12`. All card animations (deal, hover, flip, reveal) take roughly 3× longer than intended — cards drift to their positions over several seconds instead of moving crisply.

## Reproduction

Hover over cards or deal a hand. Animations are noticeably slow — cards creep to their targets over 2–4 seconds instead of settling in under a second.

## Expected Behavior

Cards animate to their target positions in ~0.3–0.8 seconds with a smooth ease-out feel.

## Actual Behavior

With `lerpSpeed=0.04`, cards take 2–5 seconds to reach their targets — the app feels unresponsive.
