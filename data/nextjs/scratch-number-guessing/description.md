# Number Guessing Game

A classic number guessing game where the player tries to guess a secret number between 1 and 100.

## Layout
- Page title: "Number Guessing Game"
- An input field: aria-label "Your Guess" (number input)
- A "Guess" button
- Feedback display: `data-testid="feedback"` — shows hint after each guess
- Guesses remaining: `data-testid="guesses-remaining"` — how many guesses the player has left
- Guess history list: each previous guess shown as `data-testid="guess-history-item"`
- A "New Game" button: `data-testid="new-game-btn"` — starts a fresh game with a new secret number

## Game Configuration
- Secret number range: 1 to 100 (inclusive), chosen randomly on mount and "New Game"
- Maximum guesses: 10

## Feedback Messages (shown in `data-testid="feedback"`)
- After a guess that is too low: "Too low! Try higher."
- After a guess that is too high: "Too high! Try lower."
- Correct guess: "Correct! You guessed it in {N} guess(es)!"
- Out of guesses (no more guesses, game over): "Game over! The number was {secret}."
- Initial state (no guess yet): "Guess a number between 1 and 100."

## Interactions
1. Player types a number into the input.
2. Player clicks "Guess" (or presses Enter).
3. Feedback updates, guesses remaining decrements by 1.
4. The guess is added to the history list (most recent first, showing the guessed value).
5. If correct or out of guesses, the "Guess" button and input become disabled.
6. "New Game" resets: new secret number, 10 guesses remaining, clears history and feedback to initial message.

## Validation
- Ignore guesses outside 1–100: show `data-testid="validation-error"` with text "Please enter a number between 1 and 100." — do not decrement guesses remaining.
- Ignore empty input: same validation error.
- After valid guess, clear the input field.

## Data-testids
- `feedback` — hint message
- `guesses-remaining` — number of guesses left (e.g., "10", "9", ...)
- `guess-history-item` — each item in guess history
- `new-game-btn` — New Game button
- `validation-error` — shown for invalid input (hidden when not relevant)
