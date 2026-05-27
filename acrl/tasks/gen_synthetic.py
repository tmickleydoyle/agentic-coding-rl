"""Synthetic executable-task generation for rung 3. SCAFFOLD — not yet implemented.

This is the lever behind Composer 2.5's jump (~25x more synthetic tasks). The pipeline:

  1. Seed from real distribution: sample prompts/diffs from the easystore coding-agent
     sessions (read the prompt pool the opencode-language-model repo already extracted to
     analysis/router_classifications.json — by absolute path, no USB re-scan).
  2. Generate: ask a strong model to turn each seed into a self-contained task with a
     reference solution AND a test suite.
  3. VALIDATE (critical): run the reference solution against its own tests in the sandbox;
     KEEP only tasks whose reference passes. This is what keeps bad synthetic tasks from
     teaching bad behavior — the #1 risk at this rung.
  4. Emit Task records compatible with acrl.tasks.build_tasks.Task.

Output feeds the same trainer + reward as every other rung; only scale changes.
"""

from __future__ import annotations

PROMPT_POOL = "/Users/tmickleydoyle/Repos/opencode-language-model/analysis/router_classifications.json"


def generate_tasks(n: int, seed_pool: str = PROMPT_POOL, validate: bool = True):
    """Generate + validate n synthetic executable tasks. SCAFFOLD."""
    raise NotImplementedError("rung 3: synthetic task generation + reference-passes-tests validation")
