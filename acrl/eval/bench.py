"""Evaluate a policy on held-out tasks: report solve-rate (the real signal).

Compares base vs. RL-tuned (LoRA adapter) by generating completions on the test split
and scoring them with the same verifiable reward used in training. Reports:
  - pass@1   : fraction of tasks where ALL tests pass
  - mean frac: average fraction of tests passing (the dense reward)

Run on a CUDA box.  pip install ".[gpu]"

    python -m acrl.eval.bench --model Qwen/Qwen2.5-Coder-1.5B-Instruct --split test
    python -m acrl.eval.bench --adapter outputs/rung1/adapter --split test
"""

from __future__ import annotations

import argparse

from acrl.reward.verifiable import extract_code
from acrl.sandbox.runner import run_python_task
from acrl.tasks.build_tasks import load_tasks


def _load_model(model_id: str, adapter: str | None):
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    tok = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id, dtype=torch.bfloat16, device_map="auto")
    if adapter:
        from peft import PeftModel

        model = PeftModel.from_pretrained(model, adapter)
    model.eval()
    return model, tok


def _generate(model, tok, prompt: str, max_new_tokens: int, temperature: float) -> str:
    messages = [{"role": "user", "content": prompt}]
    inputs = tok.apply_chat_template(
        messages, add_generation_prompt=True, return_tensors="pt"
    ).to(model.device)
    do_sample = temperature > 0
    out = model.generate(
        inputs,
        max_new_tokens=max_new_tokens,
        do_sample=do_sample,
        temperature=temperature if do_sample else None,
        top_p=0.95 if do_sample else None,
        pad_token_id=tok.pad_token_id or tok.eos_token_id,
    )
    return tok.decode(out[0][inputs.shape[-1]:], skip_special_tokens=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="Qwen/Qwen2.5-Coder-1.5B-Instruct")
    ap.add_argument("--adapter", default=None, help="LoRA adapter dir (omit for base model)")
    ap.add_argument("--source", default="bundled", choices=["bundled", "mbpp", "humaneval"])
    ap.add_argument("--split", default="test")
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--max-new-tokens", type=int, default=256)
    ap.add_argument("--temperature", type=float, default=0.0)
    args = ap.parse_args()

    tasks = load_tasks(source=args.source, split=args.split, limit=args.limit)
    print(f"[bench] {len(tasks)} tasks | model={args.model} | adapter={args.adapter or 'none'}")

    model, tok = _load_model(args.model, args.adapter)

    n_all_pass = 0
    frac_sum = 0.0
    for t in tasks:
        completion = _generate(model, tok, t.model_prompt(), args.max_new_tokens, args.temperature)
        code = extract_code(completion)
        result = run_python_task(code, t.tests, setup=t.setup)
        n_all_pass += int(result.all_passed)
        frac_sum += result.fraction
        flag = "PASS" if result.all_passed else f"{result.passed}/{result.total}"
        print(f"  {t.task_id:32s} {flag}")

    n = len(tasks)
    print("\n=== results ===")
    print(f"pass@1     : {n_all_pass}/{n} = {n_all_pass / n:.3f}")
    print(f"mean frac  : {frac_sum / n:.3f}")


if __name__ == "__main__":
    main()
