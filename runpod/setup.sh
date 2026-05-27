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

echo "[setup] sanity check:"
python -c "import torch, trl, peft, vllm; print('torch', torch.__version__, '| cuda', torch.cuda.is_available())"
echo "[setup] done. Launch with: bash runpod/run.sh"
echo "[setup] note: to log to Weights & Biases (--wandb), export WANDB_API_KEY before run.sh."
