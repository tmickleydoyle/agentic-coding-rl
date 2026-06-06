# Match Log

A single-page React app for recording and reviewing game match results. Users can add new match entries and filter the log by outcome.

## Seed Data

Five matches pre-loaded:

| Date       | Opponent         | Our Score | Their Score | Result |
|------------|------------------|-----------|-------------|--------|
| 2024-03-01 | River City FC    | 3         | 1           | Win    |
| 2024-03-08 | Valley United    | 0         | 2           | Loss   |
| 2024-03-15 | Hilltop Rangers  | 2         | 2           | Draw   |
| 2024-03-22 | Eastside Eagles  | 4         | 0           | Win    |
| 2024-03-29 | Northern Wolves  | 1         | 3           | Loss   |

## Fields

- **Date**: ISO date string (YYYY-MM-DD)
- **Opponent**: team name (string)
- **Our Score**: non-negative integer
- **Their Score**: non-negative integer
- **Result**: auto-computed — "Win" if our score > their score, "Loss" if less, "Draw" if equal

## UI Elements

- Page heading: "Match Log"
- A summary bar showing total Wins, Losses, Draws counts with `data-testid="summary-wins"`, `"summary-losses"`, `"summary-draws"`
- A filter row with label "Filter by Result" and a `<select>` with options: All, Win, Loss, Draw — `data-testid="result-filter"`
- An "Add Match" form with:
  - Date input `data-testid="input-date"`
  - Opponent text input `data-testid="input-opponent"`
  - Our Score number input `data-testid="input-our-score"`
  - Their Score number input `data-testid="input-their-score"`
  - Submit button with text "Add Match" `data-testid="btn-add-match"`
- A list of match entries; each entry has `data-testid="match-entry"`
- Within each entry: `data-testid="entry-date"`, `"entry-opponent"`, `"entry-our-score"`, `"entry-their-score"`, `"entry-result"`

## Behaviors

1. **Initial render**: 5 seed matches shown, summary shows Wins: 2, Losses: 2, Draws: 1.
2. **Filter**: selecting "Win" shows only the 2 win entries; "Draw" shows 1; "All" restores all.
3. **Add match**: filling the form and clicking "Add Match" appends a new entry to the list.
4. **Result auto-computed**: if our score > their score → "Win", equal → "Draw", less → "Loss".
5. **Summary updates**: after adding a match, the summary counts update to reflect new totals.
6. **Form clears**: after submitting, input fields reset to empty/zero.
7. **Newest first**: new matches appear at the top of the list (prepended).

## Edge Cases

- Adding a draw match increments Draw count.
- Summary counts reflect only currently-filtered results (summary always shows totals across ALL matches, not just filtered).
- If opponent field is empty, the Add Match button does nothing (no entry added).
- Score inputs accept 0 as a valid value.
