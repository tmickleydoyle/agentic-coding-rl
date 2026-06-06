# Decision Matrix

Build a weighted decision matrix tool that helps users compare options against multiple criteria.

## Seed Data

### Criteria (columns)
| Name | Weight |
|------|--------|
| Cost | 3 |
| Performance | 5 |
| Ease of Use | 4 |

### Options (rows)
| Name |
|------|
| Option A |
| Option B |
| Option C |

### Initial Scores (option x criterion, 1-10)
All scores start at 5.

## Layout

- Page heading: "Decision Matrix"
- A grid/table with:
  - Header row: "Option" | criterion names with their weights shown as "(w=N)"
  - One row per option: option name | score inputs for each criterion | weighted total | rank
  - Footer row: totals row (empty option cell, then sum of weights per column)
- Weighted total for each option = sum of (score * weight) for all criteria
- Rank: rank each option by weighted total descending; ties share the same rank (1-based)
- Add Criterion form: text input (label "Criterion Name") + number input (label "Weight", min 1) + "Add Criterion" button
- Add Option form: text input (label "Option Name") + "Add Option" button
- Each score cell is an `<input type="number" min="1" max="10">` with aria-label "Score for [option] on [criterion]"

## Behaviors

- Changing any score input immediately recalculates weighted totals and ranks (no submit button needed)
- "Add Criterion" adds a new column with weight as specified; all existing options get score 5 for the new criterion; name must be non-empty and weight must be a positive integer
- "Add Option" adds a new row with all criteria scored at 5; name must be non-empty
- Invalid adds (empty name, invalid weight) do nothing
- Weighted total displayed as integer (no decimals) with data-testid="total-[optionName]" (spaces replaced with hyphens, lowercased)
- Rank displayed with data-testid="rank-[optionName]" (spaces replaced with hyphens, lowercased)

## Edge Cases

- Rank 1 = highest weighted total
- If two options tie on weighted total they both show the same rank number
- Scores are clamped to 1-10 by the input min/max (no extra clamping needed in logic)
