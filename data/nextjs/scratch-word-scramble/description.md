# Word Scramble

A single-page word unscrambling game where users are shown scrambled words and must type the correct answer.

## Seed Data

```
const WORDS = [
  { word: 'react', scrambled: 'acter' },
  { word: 'typescript', scrambled: 'crsyptitep' },
  { word: 'component', scrambled: 'mponnoect' },
  { word: 'function', scrambled: 'nticonfun' },
  { word: 'variable', scrambled: 'blaavire' },
]
```

## UI Elements

- Heading: "Word Scramble"
- `<p data-testid="score">` showing current score, initially "Score: 0 / 5"
- `<p data-testid="scrambled">` showing the current scrambled word
- An `<input>` with `aria-label="Your answer"` for typing the guess
- A button "Submit" to check the answer
- A button "Skip" to skip current word
- `<p data-testid="feedback">` showing feedback: empty initially, "Correct!" or "Wrong! The word was: X" after submit, "Skipped! The word was: X" after skip
- `<p data-testid="progress">` showing "Word 1 of 5" (updates as user advances)
- When all words are done: hide the input/submit/skip, show `<p data-testid="result">` with "Game Over! You scored X out of 5."

## Behavior

### Submitting
- User types a guess and clicks "Submit"
- Compare guess (trimmed, lowercased) to the word
- If correct: increment score, show "Correct!" in feedback, advance to next word
- If wrong: show "Wrong! The word was: react" (actual word), advance to next word
- In both cases, clear the input and move to the next word

### Skipping
- User clicks "Skip": show "Skipped! The word was: react" (actual word), advance to next word, do NOT increment score, clear the input

### Advancement
- After submit or skip, the next word's scrambled form appears
- Progress indicator updates (e.g., "Word 2 of 5")
- When all 5 words exhausted: show game over message, hide input/submit/skip

### Score
- Score only increments on correct submit
- "Score: N / 5" updates after each correct answer

## Edge Cases
- Empty submit: if input is blank, do nothing (do not advance)
- Case-insensitive matching: "REACT" matches "react"
- Trimming: leading/trailing spaces are trimmed before comparison
