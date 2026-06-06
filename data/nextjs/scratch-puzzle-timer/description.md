# Puzzle Timer

A single-page React app for recording puzzle solve times. Users log puzzle attempts with a puzzle name, difficulty, and time in seconds. The app shows all attempts sorted by time (fastest first) and highlights the personal best for each puzzle.

## Seed Data

Four pre-loaded attempts:

| id | puzzle       | difficulty | time (s) |
|----|--------------|------------|----------|
| 1  | Sudoku Easy  | easy       | 120      |
| 2  | Sudoku Hard  | hard       | 480      |
| 3  | Crossword    | medium     | 300      |
| 4  | Sudoku Easy  | easy       | 95       |

## Fields

- **puzzle** (text input, label "Puzzle Name") — required
- **difficulty** (select, label "Difficulty") — options: easy, medium, hard
- **time** (number input, label "Time (seconds)") — required, must be > 0

## Behaviors

### Add Attempt
- Form with inputs for puzzle, difficulty, and time.
- Submit button labeled "Log Attempt".
- On submit: validate puzzle name non-empty and time > 0; if invalid show error "Please enter a valid puzzle name and time"; otherwise add attempt with a new id; clear the form (difficulty resets to "easy").

### Display
- All attempts rendered in `<div data-testid="attempt-item">`.
- Inside each: `<span data-testid="attempt-puzzle">`, `<span data-testid="attempt-difficulty">`, `<span data-testid="attempt-time">` (format: "{N}s").
- If this attempt is the fastest time for that puzzle name, show `<span data-testid="best-badge">Best</span>` inside the item.
- Attempts sorted by time ascending (fastest first).
- Total attempts count: `<span data-testid="attempt-count">{N} attempts</span>`.

### Filter by Difficulty
- Three buttons: "All" (data-testid="filter-all"), "Easy" (data-testid="filter-easy"), "Medium" (data-testid="filter-medium"), "Hard" (data-testid="filter-hard").
- Clicking a difficulty button filters displayed attempts to that difficulty.
- Clicking "All" shows all attempts.
- Active filter button has aria-pressed="true".

### Delete
- Each attempt has a "Delete" button (data-testid="delete-attempt").
- Clicking removes that attempt.

## Edge Cases
- When two attempts have the same puzzle name, only the fastest one gets the Best badge.
- After deleting the best attempt for a puzzle, the next fastest for that puzzle gets the Best badge.
- Filter "Hard" with only easy attempts shows 0 attempts (count updates to "0 attempts").
- Time of 0 is invalid; shows error.
