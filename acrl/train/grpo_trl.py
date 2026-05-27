"""Rung-1 / Rung-2 RL trainer: GRPO via TRL, single GPU, LoRA, vLLM rollouts.

GRPO in one breath: for each prompt sample K completions, score each with the reward
(here: fraction of unit tests passing), and push the policy toward the above-average
completions in each group, with a KL leash to the frozen base.

Run on a CUDA box (see runpod/). Requires:  pip install ".[gpu]"

    python -m acrl.train.grpo_trl --config acrl/train/config/rung1.yaml
    python -m acrl.train.grpo_trl --config acrl/train/config/rung1.yaml --reward judge --max-steps 5
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

from acrl.tasks.build_tasks import load_tasks, to_dataset


def _load_config(path: str) -> dict[str, Any]:
    import yaml

    with open(path) as f:
        return yaml.safe_load(f)


def _build_reward(name: str, timeout: float):
    if name == "verifiable":
        from functools import partial

        from acrl.reward.verifiable import verifiable_reward

        fn = partial(verifiable_reward, timeout=timeout)
        fn.__name__ = "verifiable_reward"  # TRL uses __name__ for logging
        return fn
    if name == "judge":
        from acrl.reward.judge import judge_reward

        return judge_reward
    raise ValueError(f"unknown reward: {name!r}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", default="acrl/train/config/rung1.yaml")
    ap.add_argument("--reward", choices=["verifiable", "judge"], default=None)
    ap.add_argument("--model", default=None, help="override policy model id")
    ap.add_argument("--max-steps", type=int, default=None)
    ap.add_argument("--task-source", default=None, choices=["bundled", "mbpp", "humaneval"])
    ap.add_argument("--wandb", action="store_true", help="log metrics to Weights & Biases")
    ap.add_argument("--run-name", default=None, help="W&B run name")
    ap.add_argument("--no-vllm", action="store_true", help="disable vLLM rollouts (use HF generation)")
    ap.add_argument("--learning-rate", type=float, default=None)
    ap.add_argument("--output-dir", default=None)
    args = ap.parse_args()

    cfg = _load_config(args.config)
    if args.reward:
        cfg["reward"] = args.reward
    if args.model:
        cfg["model"] = args.model
    if args.max_steps is not None:
        cfg["max_steps"] = args.max_steps
    if args.task_source:
        cfg["task_source"] = args.task_source
    if args.wandb:
        cfg["report_to"] = "wandb"
    if args.run_name:
        cfg["run_name"] = args.run_name
    if args.no_vllm:
        cfg["use_vllm"] = False
    if args.learning_rate is not None:
        cfg["learning_rate"] = args.learning_rate
    if args.output_dir:
        cfg["output_dir"] = args.output_dir

    import os

    # Fail loud instead of silently hanging: an unauthenticated wandb blocks on an
    # interactive login prompt, which deadlocks the detached tmux run in run.sh.
    if cfg.get("report_to") == "wandb" and not os.environ.get("WANDB_API_KEY"):
        raise SystemExit(
            "report_to=wandb but WANDB_API_KEY is not set. "
            "export WANDB_API_KEY=... before launching (see runpod/setup.sh)."
        )

    import torch
    from peft import LoraConfig
    from trl import GRPOConfig, GRPOTrainer

    tasks = load_tasks(
        source=cfg.get("task_source", "bundled"),
        split=cfg.get("task_split", "train"),
        limit=cfg.get("task_limit"),
    )
    print(f"[grpo] loaded {len(tasks)} training tasks from {cfg.get('task_source', 'bundled')}")
    dataset = to_dataset(tasks).map(
        lambda ex: {"prompt": [{"role": "user", "content": ex["prompt"]}]}
    )

    reward_fn = _build_reward(cfg.get("reward", "verifiable"), cfg.get("reward_timeout", 10.0))

    lora = LoraConfig(
        r=cfg.get("lora_r", 16),
        lora_alpha=cfg.get("lora_alpha", 32),
        lora_dropout=cfg.get("lora_dropout", 0.0),
        target_modules=cfg.get("lora_target_modules", "all-linear"),
        task_type="CAUSAL_LM",
    )

    grpo_kwargs = dict(
        output_dir=cfg.get("output_dir", "outputs/rung1"),
        num_generations=cfg.get("num_generations", 8),
        per_device_train_batch_size=cfg.get("per_device_train_batch_size", 8),
        gradient_accumulation_steps=cfg.get("gradient_accumulation_steps", 2),
        learning_rate=float(cfg.get("learning_rate", 1e-6)),
        beta=float(cfg.get("beta", 0.04)),
        max_prompt_length=cfg.get("max_prompt_length", 512),
        max_completion_length=cfg.get("max_completion_length", 256),
        max_steps=cfg.get("max_steps", 50),
        temperature=cfg.get("temperature", 0.8),
        top_p=cfg.get("top_p", 0.95),
        bf16=cfg.get("bf16", True),
        gradient_checkpointing=cfg.get("gradient_checkpointing", True),
        logging_steps=cfg.get("logging_steps", 1),
        save_steps=cfg.get("save_steps", 25),
        report_to=cfg.get("report_to", "none"),
        run_name=cfg.get("run_name") or f"rung1-{cfg.get('task_source', 'bundled')}",
        log_completions=True,
    )
    # vLLM kwargs are only valid/needed when rollouts use vLLM. The colocate mode
    # (vllm_mode) requires a coordinated trl+vllm+torch bump; with vLLM off, TRL
    # falls back to HF generation, which works across more versions.
    if cfg.get("use_vllm", True):
        grpo_kwargs["use_vllm"] = True
        grpo_kwargs["vllm_mode"] = cfg.get("vllm_mode", "colocate")
        grpo_kwargs["vllm_gpu_memory_utilization"] = cfg.get("vllm_gpu_memory_utilization", 0.3)

    grpo_args = GRPOConfig(**grpo_kwargs)

    trainer = GRPOTrainer(
        model=cfg["model"],
        reward_funcs=[reward_fn],
        args=grpo_args,
        train_dataset=dataset,
        peft_config=lora,
    )

    trainer.train()
    adapter_dir = str(Path(grpo_args.output_dir) / "adapter")
    trainer.save_model(adapter_dir)
    print(f"[grpo] saved LoRA adapter to {adapter_dir}")
    _ = torch  # imported for side effects / availability check


if __name__ == "__main__":
    main()
