# Trivia Timer

A timed trivia quiz app with multiple-choice questions and a countdown timer per question.

## Seed Data

```
const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    answer: "Mercury",
  },
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "58", "64"],
    answer: "56",
  },
  {
    question: "Who wrote Romeo and Juliet?",
    options: ["Dickens", "Shakespeare", "Austen", "Hemingway"],
    answer: "Shakespeare",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["O2", "CO2", "H2O", "NaCl"],
    answer: "H2O",
  },
]
const TIME_PER_QUESTION = 15
```

## UI Elements

- Heading: "Trivia Timer"
- `<p data-testid="question-number">` showing "Question 1 of 5"
- `<p data-testid="question-text">` showing the current question text
- Four `<button>`s for the answer options, each `data-testid="option"`, text = option text
- `<p data-testid="timer">` showing "Time: 15" (countdown in seconds)
- `<p data-testid="feedback">` showing feedback after answering: empty initially, "Correct!" or "Incorrect! Answer: X"
- `<p data-testid="score">` showing "Score: 0" initially
- When all questions done: hide question/options/timer, show `<p data-testid="final-score">` "Final Score: X / 5"

## Behavior

### Timer
- Timer starts counting down from 15 when the component mounts (first question).
- Uses `setInterval` every 1 second to decrement the timer.
- When timer reaches 0: treat as a wrong answer — show feedback "Incorrect! Answer: X", advance to next question, reset timer to 15.

### Answering
- User clicks an option button.
- If correct: increment score, show "Correct!" in feedback.
- If wrong: show "Incorrect! Answer: correct_answer" in feedback.
- Clear the interval, advance to next question after a 1-second delay (use setTimeout 1000ms).
- Reset timer to 15 for the next question.

### Advancement
- After answering or timeout: move to next question, reset timer to 15, restart the interval.
- Update question-number and question-text.
- After all 5 questions: stop the timer, show final-score, hide question/options/timer/feedback.

### Score
- Only increments on correct answer clicks.
- Displayed as "Score: N" during quiz.

## Edge Cases
- Timer resets to 15 on each new question.
- After the last question is answered/timed-out, show final score immediately (or after the 1-second delay).
- Options are rendered in the order given in the seed data array.
