# Dice Roller

Build a dice roller app that lets users roll multiple dice of different types and tracks roll history.

## Dice Types
Support these die types: d4, d6, d8, d10, d12, d20. Each produces a random integer from 1 to N inclusive.

## Seed Data
Start with an empty roll history (no pre-existing rolls).

## UI Layout

### Controls
- A labeled select input (label: "Die Type") with options: d4, d6, d8, d10, d12, d20. Default: d6.
- A labeled number input (label: "Number of Dice") — integer from 1 to 10. Default: 2.
- A "Roll" button. On click: generate the specified number of rolls for the selected die type, each independently random.

### Results Display
- After each roll, show the individual die results as a comma-separated list in an element with data-testid="last-roll-results".
- Show the sum of the last roll in an element with data-testid="last-roll-sum".
- Show the count of dice rolled in the last roll in an element with data-testid="last-roll-count".

### History
- Each roll event is appended to a history list. Each history entry has data-testid="history-entry".
- Each history entry shows: die type, number of dice, individual results (comma-separated), and total sum.
- A "Clear History" button removes all history entries and resets the last-roll display.

## Behavior Details
- Rolling is not deterministic (uses Math.random), so tests should verify range constraints, not exact values.
- Each individual die result must be between 1 and the die's max value (inclusive).
- The sum shown must equal the sum of individual results.
- The count shown must equal the number of dice selected.
- Clearing history should also reset the last-roll-results, last-roll-sum, last-roll-count display (show empty or "—").
- Changing die type or number of dice does not reset history, only Clear does.

## Edge Cases
- Rolling 1 die shows a single result with no trailing comma.
- Number of dice must be at least 1 (enforce with input min="1" max="10").
