# Milestone Log

A single-page React app for recording and browsing a baby's developmental milestones, organized by category.

## Seed Data

```
[
  { id: 1, category: "motor", title: "First smile", date: "2024-02-10", ageMonths: 1, description: "Smiled at mom for the first time", achieved: true },
  { id: 2, category: "motor", title: "Holds head up", date: "2024-03-01", ageMonths: 2, description: "Held head steady during tummy time", achieved: true },
  { id: 3, category: "social", title: "Laughed out loud", date: "2024-04-15", ageMonths: 3, description: "First real laugh while playing", achieved: true },
  { id: 4, category: "cognitive", title: "Reaches for objects", date: "2024-05-01", ageMonths: 4, description: "Started reaching for toys", achieved: false },
  { id: 5, category: "language", title: "Says mama", date: "2024-09-01", ageMonths: 8, description: "First word!", achieved: false },
]
```

## Fields

- **category**: "motor", "social", "cognitive", or "language"
- **title**: short name for the milestone
- **date**: YYYY-MM-DD
- **ageMonths**: non-negative integer
- **description**: free text
- **achieved**: boolean (checkbox)

## UI Elements

- Page heading: "Milestone Log"
- A form with:
  - A `<select>` labeled "Category" with options: Motor, Social, Cognitive, Language
  - A text `<input>` labeled "Title"
  - A date `<input>` labeled "Date"
  - A number `<input>` labeled "Age (months)"
  - A text `<input>` labeled "Description"
  - A checkbox `<input>` labeled "Achieved"
  - A button "Add Milestone"
- A list of milestone entries, each with `data-testid="milestone-item"` containing:
  - `data-testid="milestone-category"` showing category
  - `data-testid="milestone-title"` showing title
  - `data-testid="milestone-date"` showing date
  - `data-testid="milestone-age"` showing age in months
  - `data-testid="milestone-description"` showing description
  - `data-testid="milestone-achieved"` showing "Yes" if achieved, "No" if not
  - A "Delete" button
- A filter `<select>` labeled "Filter by Category" with options: All, Motor, Social, Cognitive, Language
- Summary section:
  - `data-testid="total-milestones"` — total count
  - `data-testid="achieved-count"` — count of achieved milestones
  - `data-testid="pending-count"` — count of not-achieved milestones

## Behaviors

1. **Add milestone**: Valid submission adds entry at top. Form resets (checkbox unchecked).
2. **Validation**: title and date are required. Empty title or date prevents add.
3. **Delete**: removes entry.
4. **Filter**: shows only entries matching selected category. "All" shows everything.
5. **Summary counts**: reflect full list, not filtered view.
6. **Newest-first**: most recently added appears at top.
7. **Achieved display**: "Yes" for achieved=true, "No" for achieved=false.

## Edge Cases

- Filter persists after adding a new milestone.
- New milestone appears in filtered list only if category matches current filter.
- pending-count = total-milestones - achieved-count.
- Deleting all achieved milestones sets achieved-count to 0.
