# Quiz Engine

A single-page multiple-choice quiz app with a fixed set of questions.

## Seed Data (5 questions, hardcoded)

```
1. What is 2 + 2?
   A) 3   B) 4*   C) 5   D) 6

2. What is the capital of France?
   A) Berlin   B) Madrid   C) Paris*   D) Rome

3. Which planet is closest to the Sun?
   A) Venus   B) Earth   C) Mars   D) Mercury*

4. What color do you get mixing red and blue?
   A) Green   B) Purple*   C) Orange   D) Yellow

5. How many sides does a hexagon have?
   A) 5   B) 7   C) 6*   D) 8
```

(* = correct answer)

## UI Layout

- Heading: "Quiz Engine"
- Progress indicator showing "Question X of 5" (data-testid="progress")
- The current question text (data-testid="question")
- Four answer buttons, each showing the option letter + text (roles: button)
- After an answer is chosen:
  - Disable all answer buttons for that question
  - Show feedback: "Correct!" or "Wrong! The answer was <correct option text>" (data-testid="feedback")
  - Show a "Next" button (hidden when on the last question, replaced by "Finish")
- "Finish" button on the last question submits the quiz
- After finishing, show the results screen:
  - Heading "Results"
  - Score: "You scored X / 5" (data-testid="score")
  - A "Restart" button that resets to question 1

## Behavior Details

- Questions are shown one at a time in order
- Selecting an answer immediately shows feedback (no separate "Submit" step)
- "Next" advances to the next question; feedback clears for the new question
- The quiz can only be restarted from the results screen
- Score counts only correct answers
- No skipping — "Next"/"Finish" only appears after an answer is selected
