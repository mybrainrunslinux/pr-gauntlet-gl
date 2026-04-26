#!/usr/bin/env node
/**
 * Parse Playwright JSON reporter output and print score JSON to stdout.
 * Usage: node scoring/scorer.js < playwright-results.json
 */
const fs = require('fs');

const CHAIN_ISSUES = new Set([16,17,18,19,20]);
const TEST_FILTERS = {
  1:'ambient-light', 2:'fov', 3:'deal-divisor', 4:'pixel-ratio', 5:'raycaster-dpr',
  6:'texture-dispose', 7:'backside', 8:'lerp-dt', 9:'reveal-scale', 10:'damping',
  11:'fan-arc', 12:'card-z-start', 13:'lerp-speed', 14:'lerpspeed-hover', 15:'resize-aspect',
  16:'chain-projection', 17:'chain-raycaster-resize', 18:'chain-cards-stretch',
  19:'chain-perspective', 20:'chain-fullscreen',
};
const TIERS = {};
[1,2,3,4,5].forEach(i => TIERS[i]=1);
[6,7,8,9,10].forEach(i => TIERS[i]=2);
[11,12,13,14,15].forEach(i => TIERS[i]=3);
[16,17,18,19,20].forEach(i => TIERS[i]=4);

const raw = fs.readFileSync('/dev/stdin', 'utf8');
const start = raw.indexOf('{');
let pw = {};
try { pw = JSON.parse(start >= 0 ? raw.slice(start) : '{}'); } catch(e) {}

const passedTitles = new Set();
for (const suite of (pw.suites || [])) {
  for (const spec of (suite.specs || [])) {
    if (spec.tests && spec.tests.every(t => t.results && t.results.every(r => r.status === 'passed'))) {
      passedTitles.add(spec.title);
    }
  }
}

const results = [];
for (let num = 1; num <= 20; num++) {
  const tf = TEST_FILTERS[num];
  const passed = [...passedTitles].some(t => t.includes(tf));
  results.push({id: num, title: tf, tier: TIERS[num], passed});
}

const fixed = results.filter(r => r.passed).length;
const chainPassed = [...CHAIN_ISSUES].filter(i => results[i-1].passed).length;
const chainBonus = chainPassed === 5 ? 10 : chainPassed > 0 ? 5 : 0;
const finalScore = Math.min(110, fixed * 5 + chainBonus);

const out = {fixed, total: 20, baseScore: fixed*5, chainBonus, finalScore, results};
process.stdout.write(JSON.stringify(out) + '\n');
