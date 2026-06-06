# Sprint Planner

Build a single-page React app that manages a sprint backlog with story points, tracks capacity, and shows velocity stats.

## Seed Data

Sprint capacity (points): `40`

Stories:
| id | title                         | points | status      |
|----|-------------------------------|--------|-------------|
| 1  | User authentication           | 8      | todo        |
| 2  | Dashboard layout              | 5      | in-progress |
| 3  | API rate limiting             | 3      | done        |
| 4  | Email notifications           | 5      | todo        |
| 5  | Search functionality          | 13     | todo        |

## Layout

- Heading: "Sprint Planner"
- Capacity input labelled "Sprint Capacity (points)" — number input, seeded to 40
- Add story form:
  - Text input labelled "Story Title"
  - Number input labelled "Story Points" (positive integer)
  - "Add Story" button
- Story list: each story has `data-testid="story-item"`
- Stats section:
  - `data-testid="total-points"`: sum of all story points
  - `data-testid="done-points"`: sum of points for stories with status `done`
  - `data-testid="remaining-points"`: total-points minus done-points
  - `data-testid="capacity-used"`: done-points as a percentage of sprint capacity, formatted as `"X%"` (rounded to nearest integer)
  - `data-testid="over-capacity"`: shown only when total-points exceeds capacity, text "Over capacity!"

## Story Item Structure

Each `data-testid="story-item"` must contain:
- The story title text
- Points displayed with `data-testid="story-points"` inside the item
- A select for status with options: `todo`, `in-progress`, `done` — changing it updates the story status
- A "Remove" button

## Add Behavior

- Title must be non-empty (trim). Points must be a positive integer. If invalid, do nothing.
- After adding, clear both inputs.
- New story gets status `todo`.

## Stats Behavior

- All stats reflect the full list (not filtered).
- `capacity-used` = `Math.round(done-points / capacity * 100)` — displayed as `"X%"`.
- `over-capacity` element: only rendered when `total-points > capacity`.

## Edge Cases

- Deleting a story updates all stats.
- Changing status to `done` immediately updates `done-points` and `capacity-used`.
- Capacity input is editable — changing it updates `capacity-used` and `over-capacity`.
