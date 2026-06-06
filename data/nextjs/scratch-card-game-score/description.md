# Card Game Score Tracker

A single-page React app for tracking scores in a card game across multiple rounds. The app shows a scoreboard with players' running totals, lets users add round scores, and highlights the current leader.

## Seed Data

Three players with two completed rounds:

| player  | round1 | round2 | total |
|---------|--------|--------|-------|
| Alice   | 15     | 22     | 37    |
| Bob     | 10     | 18     | 28    |
| Carol   | 20     | 5      | 25    |

Current round: 3.

## Fields

- Round score inputs: one number input per player, labeled with the player's name (e.g., "Alice score").
- Submit button labeled "Add Round".

## Behaviors

### Scoreboard
- Each player row rendered as `<div data-testid="player-row">`.
- Inside: `<span data-testid="player-name">`, `<span data-testid="player-total">` (running total), `<span data-testid="player-rounds">` (comma-separated list of all round scores).
- Current round number shown as `<span data-testid="current-round">Round {N}</span>`.

### Leader
- The player with the highest total has `data-testid="leader-badge"` shown next to their name (text "Leader").
- If there's a tie for highest total, all tied players show the badge.

### Add Round
- Form with one number input per player labeled "{name} score".
- On submit: validate all inputs are valid numbers (integers, can be negative or zero); if any are empty/invalid show error "Please enter valid scores for all players"; otherwise append the round scores and increment the round number.
- After successful add, inputs are cleared.

### Round count
- `<span data-testid="round-count">{N} rounds played</span>` where N is the number of completed rounds.

### Reset
- Button labeled "Reset Game" (data-testid="reset-btn").
- Restores seed data exactly (3 players, 2 rounds, totals as above).

## Edge Cases
- Negative scores are valid (penalty rounds).
- Score of 0 is valid.
- Submitting with any blank input shows the error message and does not add the round.
- After reset, totals return to seed values.
