# Build a quiz app

Build a single-page React application that runs a short multiple-choice quiz, scores it, and
shows a review.

Use exactly these three questions, in order, with the marked correct answer:

1. **What is 2 + 2?** — options `3`, `4`, `5` (correct: `4`)
2. **Capital of France?** — options `London`, `Paris`, `Rome` (correct: `Paris`)
3. **Largest planet?** — options `Earth`, `Mars`, `Jupiter` (correct: `Jupiter`)

What the app should do:

- Show **one question at a time** with its options as selectable radio choices. Display progress
  like `Question 1 of 3`.
- **Previous** and **Next** buttons move between questions. Previous is disabled on the first
  question and Next on the last. The user can revisit a question and change their answer before
  submitting; selections are remembered as they navigate.
- A **Submit** button scores the quiz. Unanswered questions count as wrong.
- After submitting, show the result: `You scored 2 of 3 (67%)` (percent = correct ÷ total,
  rounded to a whole number). The quiz is **passed at 70% or above** — show `Passed` or `Failed`
  accordingly.
- Show a **review** listing each question as `Question 1: Correct` or `Question 1: Incorrect`
  based on the submitted answer.
- A **Restart** button clears all answers and returns to the first question, unsubmitted.

All state is in memory. Implement the root component as the default export of `app/page.tsx`. Use
only `react` and `react-dom` — no other libraries, no Next.js APIs.
