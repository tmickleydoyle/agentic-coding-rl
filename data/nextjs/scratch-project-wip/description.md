# Work-In-Progress Project Tracker

A single-page React app to track craft projects that are currently in progress.

## Seed Data

Start with these 4 projects pre-loaded:

| id | title | type | startDate | notes | progress |
|----|-------|------|-----------|-------|----------|
| 1 | "Macrame Wall Hanging" | "Macrame" | "2024-01-10" | "Using natural cotton cord" | 40 |
| 2 | "Embroidered Tote Bag" | "Embroidery" | "2024-02-03" | "Floral design pattern" | 70 |
| 3 | "Crochet Amigurumi" | "Crochet" | "2024-03-15" | "Bunny character" | 20 |
| 4 | "Felt Flower Wreath" | "Felting" | "2024-04-01" | "Spring colors" | 90 |

## Fields

- **title** (string): project title
- **type** (string): craft type (free text)
- **startDate** (string): ISO date string YYYY-MM-DD
- **notes** (string): free-form notes
- **progress** (number): 0–100 integer percentage

## UI Layout

- Page heading: "WIP Project Tracker"
- **Add Project form**:
  - text input labeled "Title" (data-testid="input-title")
  - text input labeled "Type" (data-testid="input-type")
  - date input labeled "Start Date" (data-testid="input-date")
  - textarea labeled "Notes" (data-testid="input-notes")
  - number input labeled "Progress %" (data-testid="input-progress")
  - submit button "Add Project" (data-testid="btn-add")
- **Sort controls**: two buttons "Sort by Progress Asc" and "Sort by Progress Desc" (data-testid="sort-asc", "sort-desc")
- **Project list**: each project in a card with:
  - data-testid="project-{id}" on the card
  - data-testid="project-title-{id}" showing title
  - data-testid="project-type-{id}" showing type
  - data-testid="project-date-{id}" showing startDate
  - data-testid="project-notes-{id}" showing notes
  - data-testid="project-progress-{id}" showing progress as "X%"
  - A number input data-testid="edit-progress-{id}" (value = current progress) to update progress inline
  - A button "Update" (data-testid="btn-update-{id}") to save the inline progress edit
  - A button "Delete" (data-testid="btn-delete-{id}")
- **Average progress** (data-testid="avg-progress"): "Average: X%" where X is rounded integer average

## Behaviors

1. **Add Project**: title and type required. Progress clamped to 0–100. startDate defaults to today if blank. Appends project. Form clears.
2. **Empty title guard**: blank title = no-op.
3. **Sort Asc**: re-orders displayed list by progress ascending (lowest first).
4. **Sort Desc**: re-orders displayed list by progress descending (highest first).
5. **Inline Progress Update**: user types new value in edit-progress input and clicks Update. Display updates to new value.
6. **Delete**: removes project.
7. **Average progress**: computed across all projects (not filtered).

## Edge Cases

- Progress input in add form: values outside 0–100 are clamped (0 if < 0, 100 if > 100).
- If list is empty, show data-testid="empty-msg" with "No projects yet".
- Inline edit input must accept 0 as a valid value.
