# Issue #10: damping

**Difficulty:** Tier 2 (Moderate)
**File(s):** `app/index.html`
**Type:** Orbit controls damping disabled

## Description

`OrbitControls.enableDamping` is set to `false`. Without damping, camera rotation stops abruptly when the mouse is released — there's no momentum or inertia, making the camera feel stiff and unpolished.

## Reproduction

Click and drag to rotate the camera, then release. The rotation stops instantly with no smooth deceleration.

## Expected Behavior

Camera rotation decelerates smoothly after mouse release (damping enabled, `dampingFactor` ≈ 0.05).

## Actual Behavior

Camera snaps to a stop — no inertia.
