#!/usr/bin/env bash
# PR-Gauntlet (gl) — local scoring helper
#
# Use this to check your score locally before submitting a PR.
# Fix the bugs in app/index.html using your tool of choice, then run:
#
#   bash run.sh           # score all 20 issues
#   bash run.sh 1         # score a single issue
#   bash run.sh 1 5 16    # score specific issues
#
# Submit: push your branch and open a PR against v1-bugged.
# CI will run the full score and post results as a PR comment.

set -euo pipefail

REPO_DIR="$(git rev-parse --show-toplevel)"
cd "$REPO_DIR"

if [ ! -d node_modules ]; then
    echo "Installing dependencies..."
    npm install -q
fi

if [[ $# -eq 0 ]]; then
    # Full run — score all 20
    npx playwright test scoring/test_issues.spec.js \
        --config scoring/playwright.config.js \
        --reporter=list
else
    # Score specific issues
    for NUM in "$@"; do
        case $NUM in
            1)  F="ambient-light";;       2)  F="fov";;
            3)  F="deal-divisor";;        4)  F="pixel-ratio";;
            5)  F="raycaster-dpr";;       6)  F="texture-dispose";;
            7)  F="backside";;            8)  F="lerp-dt";;
            9)  F="reveal-scale";;        10) F="damping";;
            11) F="fan-arc";;             12) F="card-z-start";;
            13) F="lerp-speed";;          14) F="lerpspeed-hover";;
            15) F="resize-aspect";;       16) F="chain-projection";;
            17) F="chain-raycaster-resize";;18) F="chain-cards-stretch";;
            19) F="chain-perspective";;   20) F="chain-fullscreen";;
            *) echo "Unknown issue: $NUM"; exit 1;;
        esac
        npx playwright test scoring/test_issues.spec.js \
            --grep "$F" \
            --config scoring/playwright.config.js \
            --reporter=list
    done
fi
