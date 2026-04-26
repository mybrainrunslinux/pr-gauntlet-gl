/**
 * MindBend scoring tests — 20 issues.
 *
 * Each test MUST:
 *   - FAIL on v1-bugged (current buggy code)
 *   - PASS on v0-clean (or after the correct fix is applied)
 *
 * Strategy: source-code checks for subtleties that don't render in a headless
 * browser; runtime/DOM checks for bugs that produce observable visual output.
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const SRC = fs.readFileSync(path.join(__dirname, '../app/index.html'), 'utf8');

// ── Tier 1: Clear ──────────────────────────────────────────────────────────────

test('01 ambient-light — intensity must not be 0.0', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.scene != null, { timeout: 10_000 });
  const intensity = await page.evaluate(() => {
    const light = window.scene.children.find(c => c.isAmbientLight || c.type === 'AmbientLight');
    return light ? light.intensity : null;
  });
  expect(intensity).not.toBeNull();
  expect(intensity).toBeGreaterThan(0.0);
});

test('02 fov — camera FOV must be ≤ 90° (not 120°)', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.camera != null, { timeout: 10_000 });
  const fov = await page.evaluate(() => window.camera.fov);
  expect(fov).toBeLessThanOrEqual(90);
});

test('03 deal-divisor — fan spread must use (n-1) divisor', async () => {
  // Bug: i / n  →  Fix: i / (n - 1)
  expect(SRC).not.toMatch(/:\s*i\s*\/\s*n\b/);
});

test('04 pixel-ratio — renderer must use window.devicePixelRatio, not hardcoded 1', async () => {
  // Bug: renderer.setPixelRatio(1) — blurry on HiDPI displays
  // Fix: renderer.setPixelRatio(window.devicePixelRatio)
  expect(SRC).not.toMatch(/setPixelRatio\s*\(\s*1\s*\)/);
  expect(SRC).toMatch(/setPixelRatio\s*\(\s*window\.devicePixelRatio\s*\)/);
});

test('05 raycaster-dpr — mouse coords must NOT divide by devicePixelRatio', async () => {
  // Bug: mouse.x = (clientX / (innerWidth * devicePixelRatio)) * 2 - 1
  // Fix: mouse.x = (clientX / innerWidth) * 2 - 1
  expect(SRC).not.toMatch(/clientX\s*\/\s*\(.*devicePixelRatio\)/);
});

// ── Tier 2: Moderate ──────────────────────────────────────────────────────────

test('06 texture-dispose — clearCards must dispose texture map', async () => {
  // Bug: child.material.map.dispose() is in a COMMENT (omitted from actual code)
  // Fix: actual call, not just a comment
  // Strip single-line comments, then check for the real call
  const noComments = SRC.replace(/\/\/[^\n]*/g, '');
  expect(noComments).toMatch(/material\.map\.dispose\(\)/);
});

test('07 backside — back mesh side must be FrontSide or DoubleSide, not BackSide', async () => {
  // Bug: backMat uses THREE.BackSide — card back invisible from front after flip
  // Fix: use THREE.FrontSide with Y rotation, or DoubleSide
  expect(SRC).not.toMatch(/THREE\.BackSide/);
});

test('08 lerp-dt — lerp factor must be clamped to (0,1] for frame-rate independence', async () => {
  // Bug: k = lerpSpeed * dt  (can exceed 1.0 at low framerates → overshoot)
  // Fix: k = 1 - Math.exp(-lerpSpeed * dt)   OR   Math.min(lerpSpeed * dt, 1)
  expect(SRC).not.toMatch(/=\s*u\.lerpSpeed\s*\*\s*dt\b/);
});

test('09 reveal-scale — reveal targetScale must be > 0.5 (not 0.01)', async () => {
  // Bug: card.userData.targetScale = 0.01 in revealSelected() — card shrinks to invisible
  // Fix: targetScale = 1.4 or similar zoom-in value
  expect(SRC).not.toMatch(/targetScale\s*=\s*0\.01\b/);
});

test('10 damping — OrbitControls.enableDamping must be true', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.controls != null, { timeout: 10_000 });
  const damping = await page.evaluate(() => window.controls.enableDamping);
  expect(damping).toBe(true);
});

// ── Tier 3: Vague ─────────────────────────────────────────────────────────────

test('11 fan-arc — FAN_ARC must be < Math.PI * 2', async () => {
  // Bug: FAN_ARC = Math.PI * 2.0  → full circle, cards stack
  expect(SRC).not.toMatch(/FAN_ARC\s*=\s*Math\.PI\s*\*\s*2/);
});

test('12 card-z-start — stacked z offset must be small (not index * 2.0)', async () => {
  // Bug: targetPos z = index * 2.0  → cards spread 2 units apart in z
  expect(SRC).not.toMatch(/index\s*\*\s*2\.0/);
});

test('13 lerp-speed — base lerpSpeed must be higher than 0.04 (not sluggish)', async () => {
  // Bug: lerpSpeed: 0.04 — cards take 2–5 seconds to animate (too slow)
  expect(SRC).not.toMatch(/lerpSpeed\s*:\s*0\.04\b/);
});

test('14 lerpspeed-hover — pointermove hover handler must exist', async () => {
  // Bug: hover interaction handler is entirely missing — cards don't respond to mouse hover
  // Fix: add a pointermove listener that sets targetScale for hovered cards
  expect(SRC).toMatch(/pointermove|mousemove/);
});

test('15 resize-aspect — onResize must update camera.aspect and call updateProjectionMatrix', async () => {
  // Bug: onResize only calls renderer.setSize — camera stays at old aspect
  expect(SRC).toMatch(/camera\.aspect\s*=/);
  expect(SRC).toMatch(/camera\.updateProjectionMatrix\(\)/);
});

// ── Tier 4: Chain (root: missing camera.updateProjectionMatrix in onResize) ────

test('16 chain-projection — resize must call updateProjectionMatrix', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.camera != null, { timeout: 10_000 });
  const before = await page.evaluate(() => window.camera.projectionMatrix.elements[0]);
  // Simulate resize with a different aspect
  await page.evaluate(() => {
    Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => window.camera.projectionMatrix.elements[0]);
  // projectionMatrix[0] encodes aspect ratio — must change after resize
  expect(after).not.toBeCloseTo(before, 3);
});

test('17 chain-raycaster-resize — projectionMatrix must change after resize', async ({ page }) => {
  // Same root as 16 — stale projection means raycaster mis-fires after resize
  await page.goto('/');
  await page.waitForFunction(() => window.camera != null, { timeout: 10_000 });
  const before = await page.evaluate(() => window.camera.projectionMatrix.elements[5]);
  await page.evaluate(() => {
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => window.camera.projectionMatrix.elements[5]);
  // element[5] = 1/tan(fov/2) — only changes if updateProjectionMatrix() was called
  expect(after).not.toBeCloseTo(before, 3);
});

test('18 chain-cards-stretch — camera aspect must match window after resize', async ({ page }) => {
  // Root cause: camera.aspect not updated → cards stretch/squish
  await page.goto('/');
  await page.waitForFunction(() => window.camera != null, { timeout: 10_000 });
  await page.evaluate(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 400, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(200);
  const aspect = await page.evaluate(() => window.camera.aspect);
  expect(aspect).toBeCloseTo(1200 / 400, 1);
});

test('19 chain-perspective — camera projection matrix must change after window resize', async () => {
  // Source check: updateProjectionMatrix must appear after camera.aspect =
  const aspectIdx = SRC.indexOf('camera.aspect =');
  const projIdx = SRC.indexOf('camera.updateProjectionMatrix()');
  expect(aspectIdx).toBeGreaterThan(-1);
  expect(projIdx).toBeGreaterThan(aspectIdx);
});

test('20 chain-fullscreen — fullscreen resize must update both aspect and projection', async ({ page }) => {
  // Fullscreen triggers resize — camera must stay correct in both orientations
  await page.goto('/');
  await page.waitForFunction(() => window.camera != null, { timeout: 10_000 });
  const before = await page.evaluate(() => ({
    aspect: window.camera.aspect,
    pm0: window.camera.projectionMatrix.elements[0],
  }));
  await page.evaluate(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => ({
    aspect: window.camera.aspect,
    pm0: window.camera.projectionMatrix.elements[0],
  }));
  expect(after.aspect).toBeCloseTo(1920 / 1080, 1);
  expect(after.pm0).not.toBeCloseTo(before.pm0, 3);
});
