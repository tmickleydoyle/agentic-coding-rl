# Election Tracker

A single-page election results tracker that displays candidates, their vote counts, and highlights the current leader.

## Seed Data

Start with the following candidates pre-loaded:

| Name              | Party       | Votes  |
|-------------------|-------------|--------|
| Alice Mercer      | Progressive | 14200  |
| Bob Harrington    | Conservative| 13800  |
| Carol Nguyen      | Independent | 4100   |

## UI Layout

- Page heading: "Election Tracker"
- A summary bar showing total votes counted so far
- A list of candidate cards, each displaying:
  - Candidate name
  - Party affiliation
  - Vote count
  - A percentage of total votes (rounded to one decimal place)
  - A "LEADING" badge on the candidate with the most votes
- An "Add Votes" form below the list with:
  - A dropdown to select a candidate by name
  - A number input for votes to add (positive integers only)
  - A submit button labeled "Add Votes"
- A "Reset" button that restores the original seed data

## Behaviors

### Displaying Candidates
- Candidates are sorted by vote count descending (most votes first).
- The candidate with the highest vote count shows a "LEADING" badge (data-testid="leading-badge").
- If two candidates are tied for first, both show the badge.
- Percentage is recalculated after every vote update.
- Total votes display updates in real time.

### Adding Votes
- Select a candidate from the dropdown and enter a positive number.
- Clicking "Add Votes" increments that candidate's vote count by the entered amount.
- After submission the number input clears to empty.
- If the input is 0 or negative, do nothing (no state change, no error shown).
- If no candidate is selected, the button does nothing.

### Reset
- Clicking "Reset" restores all vote counts to seed values and re-sorts the list.

## data-testid Attributes

- `"total-votes"` — element showing total vote count
- `"candidate-card"` — each candidate card (there will be 3)
- `"candidate-name"` — candidate name inside a card
- `"candidate-party"` — party affiliation inside a card
- `"candidate-votes"` — vote count inside a card
- `"candidate-pct"` — percentage display inside a card
- `"leading-badge"` — the LEADING indicator (only on the leading candidate(s))
- `"candidate-select"` — the candidate dropdown
- `"votes-input"` — the votes number input
- `"add-votes-btn"` — the submit button
- `"reset-btn"` — the reset button

## Edge Cases

- After adding votes the percentage of ALL candidates updates, not just the selected one.
- Resetting while a candidate is selected in the dropdown leaves the dropdown in its current state (do not reset the form).
- The LEADING badge must not appear when no candidates exist (not applicable with seed data but guard against it).
