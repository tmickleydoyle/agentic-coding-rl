# Typing Test

A single-page typing speed test app where users type a given passage and see their WPM and accuracy.

## Seed Data

Use this fixed passage (constant at top of file):

```
const PASSAGE = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump."
```

## UI Elements

- Heading: "Typing Test"
- A `<p>` showing the target passage, `data-testid="passage"`
- A `<textarea>` with `aria-label="Type here"` where the user types
- A button "Start" (visible when test has not started)
- A button "Reset" (visible after test starts or finishes)
- A `<p data-testid="wpm">` showing current WPM (words per minute), initially "WPM: 0"
- A `<p data-testid="accuracy">` showing accuracy percentage, initially "Accuracy: 100%"
- A `<p data-testid="status">` showing: "Press Start to begin", "Typing...", or "Finished!"

## Behavior

### Starting
- User clicks "Start" — status becomes "Typing...", textarea is enabled (initially disabled), timer starts tracking elapsed time from first character.
- Actually, textarea becomes enabled after clicking Start. Before Start, textarea is disabled.

### Typing
- As user types in the textarea, compute in real time:
  - **WPM**: `Math.round((correctWords / elapsedMinutes))` where `correctWords` = number of words in the typed text that match the corresponding words in the passage (by position), and `elapsedMinutes` = seconds elapsed since Start / 60. Show as "WPM: N".
  - **Accuracy**: `Math.round((correctChars / typedChars) * 100)` where `correctChars` = number of characters in typed text that match the passage at the same index, `typedChars` = typed text length. If nothing typed, show 100%. Show as "Accuracy: N%".
- When user has typed at least as many characters as the passage length, status becomes "Finished!" and the textarea is disabled again.

### Reset
- Clicking "Reset" clears the textarea, resets WPM to 0, accuracy to 100%, status to "Press Start to begin", textarea disabled, and the timer is cleared. "Start" button reappears.

## Timer
- Track elapsed seconds using `Date.now()` difference from when Start was clicked.
- Recompute WPM on each keystroke using elapsed time.
- If elapsed time is 0, show WPM: 0.

## Edge Cases
- If user has not typed anything, accuracy = 100%.
- WPM and accuracy display update on every character typed.
- After finishing, typing more is not possible (textarea disabled).
