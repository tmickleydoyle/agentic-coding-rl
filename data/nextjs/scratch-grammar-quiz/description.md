# Grammar Quiz

A multiple-choice grammar quiz app that presents questions one at a time, shows answer feedback, tracks score, and allows restarting.

## Seed Data

```
const QUESTIONS = [
  { id: 1, question: "Which is correct?", options: ["She go to school", "She goes to school", "She going to school", "She gone to school"], answer: 1 },
  { id: 2, question: "Choose the correct form:", options: ["They was happy", "They were happy", "They be happy", "They been happy"], answer: 1 },
  { id: 3, question: "Pick the right word:", options: ["Its raining", "It's raining", "Its' raining", "It raining"], answer: 1 },
  { id: 4, question: "Which sentence is correct?", options: ["I have went", "I have go", "I have gone", "I have going"], answer: 2 },
  { id: 5, question: "Select the correct option:", options: ["Their going home", "There going home", "They're going home", "Theyre going home"], answer: 2 },
]
```

Answer index is 0-based within options array.

## UI Structure

- `<h1>` with text "Grammar Quiz"
- `data-testid="question-number"` showing "Question X of Y" (X = 1-based current index, Y = total)
- `data-testid="score"` showing "Score: X" where X = correct answers so far
- `data-testid="question-text"` showing current question text
- For each option (0..3):
  - `data-testid="option-{i}"` button showing the option text (i is 0-based)
- After answering:
  - `data-testid="feedback"` showing "Correct!" or "Incorrect. The answer is: {correct option text}"
  - `data-testid="next-btn"` button with text "Next" (or "Finish" on last question)
- After all questions answered (quiz complete):
  - `data-testid="final-score"` showing "Final Score: X / Y"
  - `data-testid="restart-btn"` button with text "Restart"
  - Option buttons and question are no longer shown

## Behaviors

1. **Start**: First question shown, no feedback visible, score is 0.
2. **Answer**: Clicking an option disables all option buttons and shows feedback.
3. **Correct**: If selected option index equals answer, score increments by 1, feedback = "Correct!"
4. **Incorrect**: Feedback = "Incorrect. The answer is: {correct option text}"
5. **Next**: Clicking Next/Finish advances to next question (clears feedback, re-enables options).
6. **Finish**: On last question, button text is "Finish". Clicking it shows final-score screen.
7. **Restart**: Clicking Restart resets to question 1, score 0, no feedback, options re-enabled.
8. **No double-answer**: Once an option is clicked, all options are disabled until Next is clicked.

## Edge Cases

- feedback element should not exist in DOM before any answer is given on a question.
- final-score and restart-btn should not exist until quiz is complete.
- next-btn should not exist until an answer is selected.
