#!/usr/bin/env bash
# First-boot setup on a RunPod CUDA box for rung 1 (single-turn verifiable GRPO).
# Use /root (not /workspace) for bulk data — /workspace has a hidden ~10GB pod quota.
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
MODEL="${MODEL:-Qwen/Qwen2.5-Coder-1.5B-Instruct}"

cd "$REPO_DIR"
echo "[setup] repo: $REPO_DIR"

# GPU training deps, pinned to a coherent CUDA-12.4 stack (see pyproject [gpu]).
# The pytorch cu124 index ensures torch resolves to a build the pod driver supports.
pip install -e ".[gpu,judge,wandb]" --extra-index-url https://download.pytorch.org/whl/cu124

# Warm the HF caches so the training run doesn't stall on first download.
echo "[setup] prefetching model: $MODEL"
python - "$MODEL" <<'PY'
import sys
from huggingface_hub import snapshot_download
snapshot_download(sys.argv[1])
print("model cached")
PY

# Prefetch MBPP (the real rung-1 task source) if reachable; bundled tasks need no download.
python - <<'PY'
try:
    from datasets import load_dataset
    load_dataset("google-research-datasets/mbpp", split="test")
    print("mbpp cached")
except Exception as e:
    print(f"mbpp prefetch skipped: {e}")
PY

# Node + the Next.js task deps. Only needed for the rung-4 Next.js run, so opt-in:
# export SETUP_NODE=1 before running setup.sh. Python-only rungs skip this entirely.
if [ "${SETUP_NODE:-0}" = "1" ]; then
    echo "[setup] installing Node 20 LTS for the Next.js task verifier"
    if ! command -v node >/dev/null 2>&1; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    node --version
    if [ -d "$REPO_DIR/data/nextjs" ]; then
        echo "[setup] npm install in data/nextjs (one-time; warms node_modules + vitest)"
        (cd "$REPO_DIR/data/nextjs" && npm install --no-audit --no-fund)
        # Smoke the verifier so a broken node_modules fails loudly here, not mid-collect.
        python -m acrl.sandbox.nextjs_runner "$REPO_DIR/data/nextjs/counter-button/reference" \
            || { echo "[setup] ERROR: nextjs verifier smoke failed"; exit 1; }
    fi
fi

echo "[setup] sanity check:"
python -c "import torch, trl, peft, vllm; print('torch', torch.__version__, '| cuda', torch.cuda.is_available())"
echo "[setup] done. Launch with: bash runpod/run.sh"
echo "[setup] note: to log to Weights & Biases (--wandb), export WANDB_API_KEY before run.sh."
echo "[setup] note: for the Next.js (rung-4) run, set SETUP_NODE=1 to install Node + task deps."
