# Issue #14: lerpspeed-hover

**Difficulty:** Tier 3 (Vague)
**File(s):** `app/index.html`
**Type:** Hover scale target too small — hover effect invisible

## Description

The hover effect's `targetScale` during mouse-over is set too close to the resting scale, making the hover highlight undetectable. Cards barely change size when hovered — the interactive affordance is lost.

## Reproduction

Hover over a card slowly. No visible size change occurs — it's impossible to tell which card is under the cursor.

## Expected Behavior

Hovering a card scales it up noticeably (e.g., 1.15×) to indicate interactivity.

## Actual Behavior

The scale change is imperceptible — hover state is visually indistinguishable from resting state.
