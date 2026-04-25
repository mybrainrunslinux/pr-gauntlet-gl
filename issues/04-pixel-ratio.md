# Issue #04: pixel-ratio

**Difficulty:** Tier 1 (Clear)
**File(s):** `app/index.html`
**Type:** Hardcoded pixel ratio — blurry on HiDPI displays

## Description

`renderer.setPixelRatio(1)` forces a 1:1 pixel ratio regardless of the device's actual pixel density. On HiDPI / Retina displays (DPR = 2+), all rendering is blurry and jagged — card text and edges are noticeably soft.

## Reproduction

Open `index.html` on a Retina/HiDPI display. Card faces and edges appear blurry compared to the rest of the page.

## Expected Behavior

`renderer.setPixelRatio(window.devicePixelRatio)` — crisp rendering on all displays.

## Actual Behavior

Hardcoded to 1 — blurry on any display with DPR > 1.
