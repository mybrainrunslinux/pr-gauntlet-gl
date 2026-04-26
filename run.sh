#!/usr/bin/env bash
# PR-Gauntlet (gl) — local scoring + submission helper
#
# Fix bugs in app/index.html using any tool, then:
#
#   bash run.sh           # score all 20 issues
#   bash run.sh 1         # score a single issue
#   bash run.sh --submit  # push branch + open PR against v1-bugged
#
# Branch is auto-named arena-<github-username> so competitors never collide.

set -euo pipefail

REPO_DIR="$(git rev-parse --show-toplevel)"
cd "$REPO_DIR"

# ── helpers ────────────────────────────────────────────────────────────────────
get_filter() {
    case $1 in
        1)  echo "ambient-light";;        2)  echo "fov";;
        3)  echo "deal-divisor";;         4)  echo "pixel-ratio";;
        5)  echo "raycaster-dpr";;        6)  echo "texture-dispose";;
        7)  echo "backside";;             8)  echo "lerp-dt";;
        9)  echo "reveal-scale";;         10) echo "damping";;
        11) echo "fan-arc";;              12) echo "card-z-start";;
        13) echo "lerp-speed";;           14) echo "lerpspeed-hover";;
        15) echo "resize-aspect";;        16) echo "chain-projection";;
        17) echo "chain-raycaster-resize";;18) echo "chain-cards-stretch";;
        19) echo "chain-perspective";;    20) echo "chain-fullscreen";;
        *)  echo "ERROR: unknown issue $1" >&2; exit 1;;
    esac
}

get_slug() {
    if command -v gh &>/dev/null && gh auth status &>/dev/null 2>&1; then
        gh api user --jq .login 2>/dev/null && return
    fi
    git config user.name 2>/dev/null \
        | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/-$//' \
        && return
    echo "$(hostname | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')-$(date +%s | tail -c 6)"
}

ensure_branch() {
    local branch
    branch=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$branch" == "v1-bugged" ]]; then
        local slug arena_branch
        slug=$(get_slug)
        arena_branch="arena-${slug}"
        echo "Creating branch: $arena_branch"
        git checkout -b "$arena_branch"
    fi
}

ensure_deps() {
    if [ ! -d node_modules ]; then
        echo "Installing dependencies..."
        npm install -q
    fi
    if ! npx playwright --version &>/dev/null 2>&1; then
        npx playwright install --with-deps chromium -q
    fi
}

score_all() {
    ensure_deps
    npx playwright test scoring/test_issues.spec.js \
        --config scoring/playwright.config.js \
        --reporter=list
}

score_one() {
    ensure_deps
    local filter
    filter=$(get_filter "$1")
    npx playwright test scoring/test_issues.spec.js \
        --grep "$filter" \
        --config scoring/playwright.config.js \
        --reporter=list
}

submit() {
    local branch
    branch=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$branch" == "v1-bugged" ]]; then
        echo "ERROR: still on v1-bugged — run 'bash run.sh' first to create your arena branch"
        exit 1
    fi
    if ! git diff --quiet || ! git diff --cached --quiet; then
        git add -A -- ':!node_modules' ':!**/__pycache__'
        git commit -m "arena: submission"
    fi
    git push origin "$branch"
    gh pr create \
        --repo "$(gh repo view --json nameWithOwner -q .nameWithOwner)" \
        --base v1-bugged \
        --head "$branch" \
        --title "Arena: $branch" \
        --body "Submitted via run.sh — CI will score and post results."
}

# ── dispatch ───────────────────────────────────────────────────────────────────
case "${1:-}" in
    --submit) submit;;
    "")       ensure_branch; score_all;;
    --help)   grep '^#' "$0" | sed 's/^# *//';;
    *)
        ensure_branch
        for arg in "$@"; do
            score_one "$arg"
        done
        ;;
esac
