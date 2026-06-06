# Interview Prep

A single-page React app for practicing interview questions with a flashcard-style interface and performance tracking.

## Seed Data

5 interview questions pre-loaded:

| id | category | question | answer | difficulty |
|----|----------|----------|--------|------------|
| 1 | Behavioral | Tell me about yourself | Focus on your journey, skills, and goals | Easy |
| 2 | Technical | What is a closure in JavaScript? | A function that retains access to its outer scope | Medium |
| 3 | Behavioral | Describe a challenge you overcame | Use STAR method: Situation, Task, Action, Result | Easy |
| 4 | Technical | Explain the event loop | JS runtime uses a call stack and task queue | Hard |
| 5 | System Design | Design a URL shortener | Hash URL, store mapping, handle collisions | Hard |

## UI Layout

### Header
- Title: "Interview Prep"
- Stats bar showing: total questions count, practiced count, correct count
  - `data-testid="stat-total"`, `data-testid="stat-practiced"`, `data-testid="stat-correct"`

### Filter Bar
- Category filter dropdown — `data-testid="category-filter"` (options: "All", "Behavioral", "Technical", "System Design")
- Difficulty filter dropdown — `data-testid="difficulty-filter"` (options: "All", "Easy", "Medium", "Hard")

### Question List
- Each question shown as a card — `data-testid="question-card-{id}"`
- Shows category, difficulty, and the question text
- "Show Answer" button — `data-testid="show-answer-{id}"`
- When answer is shown, display it — `data-testid="answer-{id}"`
- "Mark Correct" button (only visible when answer shown) — `data-testid="mark-correct-{id}"`
- "Mark Incorrect" button (only visible when answer shown) — `data-testid="mark-incorrect-{id}"`
- Result badge (after marking) — `data-testid="result-{id}"` showing "Correct" or "Incorrect"

### Add Question Form
- Fields: question, answer, category (select), difficulty (select)
  - `data-testid`: `input-question`, `input-answer`, `input-category`, `input-difficulty`
- Submit button — `data-testid="add-question-btn"`

### Reset
- "Reset All" button — `data-testid="reset-btn"` clears all practice results

## Behaviors

1. **Show/Hide Answer**: toggling show-answer reveals or hides the answer text.
2. **Mark Correct/Incorrect**: marks the question; updates stat-practiced and stat-correct.
3. **Category filter**: hides questions not matching selected category.
4. **Difficulty filter**: hides questions not matching selected difficulty.
5. **Filters compose**: both filters apply simultaneously.
6. **Add Question**: adds new question card; clears form.
7. **Reset All**: clears all marks, resets practiced/correct counts to 0; hides all shown answers.
8. **Stats**: stat-total = total question count; stat-practiced = questions marked (correct or incorrect); stat-correct = questions marked correct.

## Edge Cases

- Adding question with empty question or answer does nothing.
- A question can only be marked once (marking correct then incorrect is allowed to update the result).
- Empty category/difficulty filter selections default to "All".
