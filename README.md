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
- `acrl/train/` — RL trainers: TRL GRPO (early single-turn rungs) and the
  **RLOO reward-weighted SFT** pipeline in `outputs/rung4_scripts/` (the Qwen3.6-27B run).
- `acrl/eval/` — held-out solve-rate.

Only the **policy model** and **compute** change across rungs; the core stays fixed.

## The ladder (what we built)

| Rung | Proof goal | Model | Reward | Hardware | Est. cost |
|------|-----------|-------|--------|----------|-----------|
| 1 | RL loop moves reward (single-turn) | Qwen2.5-Coder-1.5B | tests pass | 1× A40/A100 | ~$10-30 |
| 2 | Agentic multi-turn in a sandboxed repo | Qwen2.5-Coder-7B | repo tests pass | 1× H100 | ~$100-400 |
| 3 | Calibrated RLOO on a strong base | Qwen3.6-27B | dense test pass-fraction | 1× A100/H100 | ~$50-100 |

## Calibration-driven RLOO (Qwen3.6-27B)

We trained **Qwen3.6-27B** (bf16, LoRA r=64 all-linear) for agentic full-app coding on the
**Next.js task corpus** (`data/nextjs/`, ~775 React/Next.js/TypeScript apps, each with a vitest suite
that defines "correct"). The model runs inside the **coding** agent (read tests → edit files → run
vitest → iterate); RL trains on the model's **own** agentic trajectories — no teacher in the loop.

Two ideas drive this run:

1. **Calibrate difficulty first.** `calibrate_nextjs.py` runs the base model K times per task and
   buckets every task by pass-fraction: **dead** (best < 0.10, no traction), **ceiling** (mean ≥ 0.90,
   no headroom), **reachable** (the middle — where the base *sometimes* succeeds). Only reachable tasks
   carry usable RL signal; training elsewhere wastes compute. The last run calibrated 743 tasks →
   ~273 reachable-train / ~40 reachable-eval.
2. **RLOO reward-weighting.** `render.py RLOO=1` turns the dense test pass-fraction into gradient via a
   leave-one-out advantage `a_i = r_i − mean(r_{−i})` over each task's K rollouts, keeps the
   positive-advantage trajectories, and `sft_nextjs.py` scales each example's loss by that weight.
   Zero-variance groups (all-pass / all-fail) net to zero and drop out automatically.

Pipeline (all on one GPU, self-hosted vLLM, $0 external API):
`calibrate_nextjs.py` → `collect_nextjs.py` (KEEP=rloo) → `render.py` (RLOO=1) → `sft_nextjs.py`
(r=64) → `finalize_nextjs.py` → `regression_gate.py` (guards general-coding erosion) →
`eval_stats.py` (base-vs-adapter on the held-out hidden suite, bootstrap CIs).

**Full runbook:** `outputs/rung4_scripts/RLOO_CALIBRATION_RUNBOOK.md`.

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
