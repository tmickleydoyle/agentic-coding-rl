# agentic-coding-rl

An incremental RL environment for building toward a **Composer-2.5-class agentic coding model**.

The capability we're chasing (an agent that reads/edits files, runs terminal commands, runs tests,
and iterates to completion) comes from **verifiable, agentic, multi-turn RL on a large
executable-task set, applied to a strong base model** — the recipe Cursor used for Composer. This
repo builds that environment from the bottom up, one provable rung at a time.

## The model-agnostic core (built once, reused at every rung)

- `acrl/tasks/` — assemble executable coding tasks `{prompt, files, test command, pass criteria}`.
- `acrl/sandbox/` — run candidate code/tool-calls in isolation and score against tests.
- `acrl/agent/` — (rung 2+) multi-turn tool loop producing a trajectory.
- `acrl/reward/` — `reward(task, output) -> float`, primarily **verifiable** (tests pass).
- `acrl/train/` — RL trainers: TRL GRPO (rungs 1-2), verl (rung 3).
- `acrl/eval/` — held-out solve-rate.

Only the **policy model** and **compute** change across rungs; the core stays fixed.

## The ladder

| Rung | Proof goal | Model | Reward | Hardware | Est. cost |
|------|-----------|-------|--------|----------|-----------|
| 1 | RL loop moves reward (single-turn) | Qwen2.5-Coder-1.5B | tests pass | 1× A40/A100 | ~$10-30 |
| 2 | Agentic multi-turn in a sandboxed repo | Qwen2.5-Coder-7B | repo tests pass | 1× H100 | ~$100-400 |
| 3 | Approach Composer-2.5 capability | Laguna-XS.2 (33B MoE) | tests pass @ scale | 2-4× H100/H200 | ~$1k+ |

## Rung 1 quickstart

Local (no GPU) — validate the sandbox + reward + tasks:

```bash
pip install -e ".[dev]"
pytest                                   # sandbox + reward unit tests
python -m acrl.tasks.build_tasks --split train --limit 5 --show
```

On a RunPod GPU box:

```bash
bash runpod/setup.sh                     # install gpu deps, pull model + tasks
bash runpod/run.sh                       # launches GRPO in tmux + caffeinate
python -m acrl.eval.bench --adapter outputs/rung1/adapter --split test
```

See `acrl/train/config/rung1.yaml` for the knobs (model, K samples/prompt, steps, LoRA).
