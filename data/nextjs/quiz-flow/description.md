# Quiz with multi-question flow

Implement a client component `Quiz` in `components/Quiz.tsx`:

- Accepts `questions: { prompt: string; choices: string[]; answer: number }[]` (answer is the index of the correct choice).
- Shows ONE question at a time:
  - `<h2 data-testid="prompt">` with the current question's text.
  - `<span data-testid="progress">` showing `"Question <n>/<total>"` (1-indexed).
  - One `<button data-testid="choice-<i>">` per choice (i = 0-based) with the choice text as its label.
- Clicking a choice advances to the next question (no preview/confirmation). The chosen index is scored: correct → +1.
- After the last question, **replace everything** with a single `<p data-testid="result">"<score>/<total>"</p>` and a `<button data-testid="restart">"Restart"</button>` that resets to question 1 with score 0.

Default export.
