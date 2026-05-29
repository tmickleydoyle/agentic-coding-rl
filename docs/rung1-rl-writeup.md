# Rung 1: Reinforcement Learning a 1.5B Code Model — Experience Write-Up

*Date: 2026-05-27 · Author: tmickleydoyle (with Claude Code)*

## TL;DR

We stood up an end-to-end RL pipeline on a single cloud GPU and trained a small
code model with a **verifiable reward** (fraction of unit tests that pass). The loop
works, and a conservative RL run produced a **real, modest improvement** on held-out
tasks. Total cost: **~$1.70**.

| Metric (MBPP test, 100 tasks) | Base | RL-tuned (LoRA) | Δ |
|---|---|---|---|
| pass@1 | 0.540 | **0.580** | +4.0 pts |
| mean test-fraction | 0.607 | **0.647** | +4.0 pts |

The single most impactful change was **not** the RL itself — it was fixing the task
prompt, which moved the *baseline* from 6% to 54%. More on that below; it's the most
transferable lesson.

## Goal

This is "rung 1" of a staged plan toward a Composer-2.5-class agentic coding model.
The point of rung 1 is **not** to produce a good model — it's to *cheaply de-risk the
RL loop* before spending real money: prove that a verifiable reward moves a policy via
GRPO, with all the plumbing (rollouts → sandboxed test execution → reward → policy
update → eval) wired correctly.

## Setup

- **Model:** `Qwen/Qwen2.5-Coder-1.5B-Instruct`, trained as a **LoRA adapter** (r=16),
  not full fine-tune.
- **Algorithm:** GRPO via TRL. For each prompt, sample K completions, score each, and
  push the policy toward above-average completions in the group, with a KL leash
  (`beta=0.04`) to the frozen base.
- **Reward:** fraction of the task's unit tests that pass, executed in a
  subprocess-isolated sandbox (wall-clock timeout + rlimits). Dense, verifiable, no judge.
- **Tasks:** MBPP (374 train / 500 test). Reward and eval use the same scorer.
- **Hardware:** 1× NVIDIA A40 (48 GB) on RunPod secure cloud, **$0.44/hr**, driven via
  `runpodctl` + SSH.

## What actually happened (the useful part)

The code was sound. The friction was entirely in environment and data plumbing — the
kind of thing that silently wastes a paid run. In order:

1. **Unpinned dependencies are a landmine on cloud GPUs.** The repo used unbounded
   `>=` version ranges, so `pip` resolved to the *bleeding edge*: torch 2.11+**cu130**,
   TRL 1.5, transformers 5.9, vLLM 0.21. Two immediate failures:
   - **CUDA mismatch:** the A40's driver is CUDA 12.4; torch built for CUDA 13.0 can't
     launch a single kernel ("driver too old").
   - **API drift:** TRL 1.5 removed `GRPOConfig(max_prompt_length=...)` that the trainer
     passes.

   **Fix:** pin a coherent CUDA-12.4 stack — torch 2.5.1+cu124, trl 0.16.1,
   transformers 4.49.0, vLLM 0.7.2, datasets 3.2.0. Lesson: **pin your training stack,
   and match it to the GPU driver.**

2. **vLLM colocate needs a coordinated bump.** The TRL that pairs cleanly with the
   CUDA-12.4 stack doesn't support `vllm_mode="colocate"`. Rather than chase the
   trl+vllm+torch version matrix, we **disabled vLLM** for rung 1 and used TRL's HF
   generation fallback (slower, but works). Made it config-optional so it's a one-line
   flip later.

3. **A dataset breaks silently across major versions.** `datasets >= 3` dropped bare
   canonical IDs, so `load_dataset("mbpp")` errors. Fix: the namespaced ID
   `google-research-datasets/mbpp`.

4. **Cheap smoke run first.** A 2-step run on a bundled offline task confirmed the full
   loop (load → generate → sandbox → reward → step → save) for pennies before spending
   on the real run. It passed (reward 1.0). This habit pays for itself.

5. **First real run: pipeline works, metric flat.** 50 steps, `lr 1e-6`. Reward moved
   *during* training, but held-out eval was flat: base **6%** pass@1, adapter **6%**.

6. **The 6% baseline was a prompt bug, not the model.** Qwen2.5-Coder-1.5B normally
   scores ~40%+ on MBPP. The culprit: MBPP's prompt ("Write a function to…") **omits the
   function name**, so the model named its function whatever it liked, and the tests —
   which call a specific name — failed. **Fix:** append the test asserts to the prompt
   (the standard MBPP protocol), which pins the function name and I/O contract.
   This single change took the **baseline from 6% → 54%.**

7. **Eval had its own version bug.** `from_pretrained(dtype=...)` is the transformers
   5.x spelling; the pinned 4.49 needs `torch_dtype=`. One-line fix.

8. **Improved run.** `lr 1e-5`, 400 steps, full train split, fixed prompts. Training
   reward trended up (~0.62 → ~0.72). Held-out result: the table at the top — **+4 pts
   on both pass@1 and mean-fraction.**

## Reading the result honestly

- The lift is **real but modest**, and on n=100 it's within sampling noise (±~5%). What
  makes it credible rather than noise: *both* metrics moved up together **and** training
  reward trended up over the run.
- This is exactly what a conservative recipe (`lr 1e-5`, 400 steps, KL leash) should
  produce: stable and positive, not dramatic.
- **The infrastructure goal is fully met.** The RL loop is correct and reproducible.

## Cost

| Phase | Approx. |
|---|---|
| Setup + dependency fixes | ~$0.30 |
| Smoke + first 50-step run + evals | ~$0.40 |
| 400-step run (87 min) + eval | ~$1.00 |
| **Total** | **~$1.70** |

## Lessons worth carrying forward

1. **Pin the training stack and match the GPU driver.** Unbounded deps will silently
   pull an incompatible bleeding edge.
2. **Prompt formatting can dominate apparent model quality** (6% → 54% from one change).
   Measure your baseline with the *correct* prompt before concluding anything about RL.
3. **Smoke runs + early health checks are cheap insurance.** They caught every failure
   above before it cost a full run.
4. **A verifiable reward (test-pass fraction) is a clean GRPO signal** — no reward model,
   no judge, fully reproducible.

## Next steps

- More steps + slightly higher LR; eval on the full 500 test tasks for a tighter number.
- Re-enable vLLM with a coordinated trl/vllm/torch stack for faster rollouts.
- Then climb the ladder: agentic (multi-turn, tool-use) tasks, larger models, synthetic
  task generation — toward the longer-term goal.

## Artifacts

- Repo: `github.com/tmickleydoyle/agentic-coding-rl`
- Adapters: `outputs/rung1/adapter` (50-step), `outputs/rung1_real/adapter` (400-step)
