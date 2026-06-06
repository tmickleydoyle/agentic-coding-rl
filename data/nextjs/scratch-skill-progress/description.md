# Craft Skill Progress Tracker

A single-page React app to track progress in various craft skills.

## Seed Data

Start with these 4 skills pre-loaded:

| id | name | level | hours |
|----|------|-------|-------|
| 1 | "Knitting" | "Beginner" | 12 |
| 2 | "Embroidery" | "Intermediate" | 35 |
| 3 | "Weaving" | "Beginner" | 5 |
| 4 | "Pottery" | "Advanced" | 120 |

## Fields

- **name** (string): skill name
- **level**: "Beginner" | "Intermediate" | "Advanced"
- **hours** (number): total hours practiced (non-negative integer)

## UI Layout

- Page heading: "Craft Skill Tracker"
- **Add Skill form**:
  - text input labeled "Skill Name" (data-testid="input-name")
  - select labeled "Level" (data-testid="select-level") with options: Beginner, Intermediate, Advanced
  - number input labeled "Hours" (data-testid="input-hours")
  - submit button "Add Skill" (data-testid="btn-add")
- **Level filter**: three buttons "All" / "Beginner" / "Intermediate" / "Advanced" (data-testid="filter-all", "filter-beginner", "filter-intermediate", "filter-advanced")
- **Skill list**: each skill in a card with:
  - data-testid="skill-{id}" on the card
  - data-testid="skill-name-{id}" showing name
  - data-testid="skill-level-{id}" showing level
  - data-testid="skill-hours-{id}" showing hours as "X hrs"
  - A button "+1 Hour" (data-testid="btn-hour-{id}") to add 1 hour
  - A button "Promote" (data-testid="btn-promote-{id}") — only visible when level is not "Advanced"
  - A button "Delete" (data-testid="btn-delete-{id}")
- **Total hours** (data-testid="total-hours"): "Total: X hrs" summed across all skills (unfiltered)

## Behaviors

1. **Add Skill**: name required. Hours must be >= 0. Appends skill. Form clears.
2. **Empty name guard**: blank name = no-op.
3. **+1 Hour**: increments hours by 1 for that skill.
4. **Promote**: advances level: Beginner -> Intermediate -> Advanced. Button hidden at Advanced.
5. **Filter**: shows only skills matching selected level. "All" shows everything.
6. **Delete**: removes skill.
7. **Total hours**: always reflects sum of all skills regardless of filter.

## Edge Cases

- Hours < 0 in add form = no-op (treat as invalid).
- If no skills match filter, show data-testid="empty-msg" with "No skills found".
- Promote button must not appear for Advanced skills.
