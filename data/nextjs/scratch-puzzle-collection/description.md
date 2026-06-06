# Puzzle Collection

A single-page React app for managing a personal puzzle collection. Users can add puzzles with categories and difficulty ratings, mark them as solved, and filter by category.

## Seed Data

Four pre-loaded puzzles:
1. Title: "Towers of Hanoi", Category: "Logic", Difficulty: 3, Solved: true, Notes: "Move all discs to target peg"
2. Title: "Rubik's Cube", Category: "Spatial", Difficulty: 5, Solved: false, Notes: "Solve all six faces"
3. Title: "Sudoku Master", Category: "Numbers", Difficulty: 4, Solved: true, Notes: "9x9 grid variant"
4. Title: "Cryptic Crossword", Category: "Words", Difficulty: 4, Solved: false, Notes: ""

## Fields per Puzzle
- `id`: unique number
- `title`: string
- `category`: one of "Logic" | "Spatial" | "Numbers" | "Words"
- `difficulty`: number 1–5
- `solved`: boolean
- `notes`: string (may be empty)

## UI Layout

### Header
- `<h1>` with text "Puzzle Collection"
- Stats: total count (`data-testid="total-puzzles"`), solved count (`data-testid="solved-count"`), unsolved count (`data-testid="unsolved-count"`)

### Filter
- Dropdown to filter by category (`data-testid="category-filter"`)
- Options: "All", "Logic", "Spatial", "Numbers", "Words"
- Default: "All" (shows all puzzles)

### Add Puzzle Form
- Text input for title (`data-testid="title-input"`)
- Select for category (`data-testid="category-input"`), options: Logic, Spatial, Numbers, Words
- Number input for difficulty (`data-testid="difficulty-input"`, min=1, max=5)
- Textarea for notes (`data-testid="notes-input"`)
- Submit button "Add Puzzle" (`data-testid="add-puzzle-btn"`)
- Validation: title and difficulty (1–5) required; category defaults to "Logic" if not changed; notes optional
- All form fields clear after successful submission

### Puzzle List
- Shows only puzzles matching the active category filter
- Each puzzle in a card (`data-testid="puzzle-card-{id}"`)
- Title (`data-testid="puzzle-title-{id}"`)
- Category badge (`data-testid="puzzle-category-{id}"`)
- Difficulty shown as "{N}/5" (`data-testid="puzzle-difficulty-{id}"`)
- Status: "Solved" or "Unsolved" (`data-testid="puzzle-status-{id}"`)
- Notes text (`data-testid="puzzle-notes-{id}"`) — shown even if empty string
- "Mark Solved" / "Mark Unsolved" toggle button (`data-testid="toggle-solved-{id}"`)
- "Remove" delete button (`data-testid="remove-puzzle-{id}"`)

## Behaviors

- Category filter hides puzzles not matching selected category; "All" shows everything
- Stats (total, solved, unsolved) always reflect ALL puzzles regardless of filter
- Toggling solved flips status; button text and status text update
- Removing a puzzle removes its card; stats update
- Adding a puzzle appends to the list; it appears under the correct filter

## Edge Cases
- Difficulty 1 and 5 are both valid
- Difficulty 0 or 6+ is invalid; do not add
- Empty title is invalid; do not add
- Notes can be empty string — still render notes element
- Filtering does not affect the stats counters
