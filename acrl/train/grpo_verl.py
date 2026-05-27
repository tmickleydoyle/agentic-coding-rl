"""Rung-3 trainer: scaled async GRPO for Laguna-XS.2 (33B MoE). SCAFFOLD — not implemented.

Why a different backend than rung 1-2: TRL single-GPU GRPO won't hold a 33B MoE. Rung 3
uses verl (or OpenRLHF), which provides what Composer's recipe needs at scale:
  - vLLM rollout workers separate from FSDP/MoE-sharded trainer workers (async off-policy),
  - expert/data parallelism for the MoE, BF16 (FP8 optional),
  - 2-4x H100/H200, LoRA on the frozen base to keep memory tractable.

What carries over UNCHANGED from rungs 1-2:
  - the task set (acrl/tasks, scaled with gen_synthetic),
  - the verifiable reward (acrl/reward/verifiable) wrapped as a verl reward worker,
  - the agent harness (acrl/agent) for multi-turn rollouts.

Only the policy model id, the parallelism/GPU topology, and the rollout transport change.
This module will hold the verl config + reward-worker adapter; see configs/laguna_scale notes
in the plan before spending here.
"""

from __future__ import annotations


def main() -> None:
    raise NotImplementedError(
        "rung 3: wire verl async RL for Laguna-XS.2 33B MoE — reuse acrl.tasks + acrl.reward + acrl.agent"
    )


if __name__ == "__main__":
    main()
