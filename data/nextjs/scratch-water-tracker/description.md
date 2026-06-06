# Water Tracker

A single-page app for tracking daily water intake.

## Seed Data

Three pre-existing log entries:
- 08:00 AM — 250 ml
- 12:30 PM — 500 ml
- 03:00 PM — 330 ml

Daily goal: 2000 ml.

## UI Elements

- Page heading: "Water Tracker"
- Total intake display (data-testid="total-intake"): e.g. "1080 ml"
- Daily goal display (data-testid="daily-goal"): "Goal: 2000 ml"
- Progress bar (data-testid="progress-bar") — an <progress> element whose `value` attribute is clamped 0-100 (percent)
- List of entries; each <li> has data-testid="log-entry" with text like "08:00 AM — 250 ml"
- Form fields:
  - Label "Amount (ml)" → number input
  - Label "Time" → time input
  - Button "Log Water"
- Button "Reset Day"

## Behaviors

### Log Water
- Valid: amount > 0 AND time not empty → appends entry, updates total and progress bar, clears inputs.
- Invalid (amount <= 0 or empty, or time empty) → does nothing.
- Progress = Math.min(100, Math.round((total / 2000) * 100)).

### Reset Day
- Clears all entries; total becomes 0; progress becomes 0.

### Goal Reached
- When total >= 2000: show element data-testid="goal-reached" with text "Goal reached!".
- When total < 2000: that element is absent.

## Edge Cases
- Total can exceed 2000 ml (unlimited logging), but progress bar stays capped at 100.
- Entries with amount 0 or negative are rejected silently.
