#!/usr/bin/env bash
# Launch rung-1 GRPO inside tmux so it survives disconnects (never as a bare bg process).
# caffeinate is used if present (local macOS); on RunPod Linux it's absent and skipped.
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
CONFIG="${CONFIG:-acrl/train/config/rung1.yaml}"
SESSION="${SESSION:-acrl_rung1}"
EXTRA_ARGS="${EXTRA_ARGS:-}"

cd "$REPO_DIR"
mkdir -p outputs

# Load local secrets (WANDB_API_KEY, ANTHROPIC_API_KEY, ...) if present.
# set -a exports everything sourced, so the detached tmux session inherits them.
if [ -f .env.local ]; then
    echo "[run] loading .env.local"
    set -a; . ./.env.local; set +a
fi

CMD="python -m acrl.train.grpo_trl --config ${CONFIG} ${EXTRA_ARGS} 2>&1 | tee outputs/train.log"
if command -v caffeinate >/dev/null 2>&1; then
    CMD="caffeinate -i -d sh -c '${CMD}'"
fi

if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "[run] tmux session '$SESSION' already exists; attach with: tmux attach -t $SESSION"
    exit 1
fi

tmux new-session -d -s "$SESSION" "$CMD"
echo "[run] launched GRPO in tmux session '$SESSION'"
echo "[run] attach:   tmux attach -t $SESSION"
echo "[run] live log: tail -f outputs/train.log"
