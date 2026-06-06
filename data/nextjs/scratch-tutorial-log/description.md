# Craft Tutorial Log

A single-page React app to log craft tutorials you've watched or plan to watch.

## Seed Data

Start with these 4 tutorials pre-loaded:

| id | title | source | duration | rating | watched |
|----|-------|--------|----------|--------|---------|
| 1 | "Beginner Crochet Basics" | "YouTube" | 45 | 5 | true |
| 2 | "Advanced Macrame Knots" | "Skillshare" | 90 | 4 | false |
| 3 | "Watercolor Florals" | "YouTube" | 30 | 5 | true |
| 4 | "Punch Needle Intro" | "Udemy" | 60 | 3 | false |

## Fields

- **title** (string): tutorial title
- **source** (string): platform/source name
- **duration** (number): length in minutes
- **rating** (number): 1–5 integer star rating
- **watched** (boolean): whether viewed

## UI Layout

- Page heading: "Tutorial Log"
- **Add Tutorial form**:
  - text input labeled "Title" (data-testid="input-title")
  - text input labeled "Source" (data-testid="input-source")
  - number input labeled "Duration (min)" (data-testid="input-duration")
  - number input labeled "Rating (1-5)" (data-testid="input-rating")
  - submit button "Add Tutorial" (data-testid="btn-add")
- **Filter bar**: buttons "All" / "Watched" / "Unwatched" (data-testid="filter-all", "filter-watched", "filter-unwatched"), plus a minimum-rating select (data-testid="filter-min-rating") with values 1–5 and "Any" (default)
- **Tutorial list**: each tutorial in a card with:
  - data-testid="tutorial-{id}" on the card
  - data-testid="tutorial-title-{id}" showing title
  - data-testid="tutorial-source-{id}" showing source
  - data-testid="tutorial-duration-{id}" showing duration as "X min"
  - data-testid="tutorial-rating-{id}" showing rating as "X/5"
  - data-testid="tutorial-watched-{id}" showing "Watched" or "Unwatched"
  - A button "Mark Watched" (data-testid="btn-watch-{id}") — only visible when watched=false
  - A button "Delete" (data-testid="btn-delete-{id}")
- **Stats bar**:
  - data-testid="total-tutorials": "X tutorials"
  - data-testid="total-watch-time": "Total: X min" summed over watched=true tutorials only

## Behaviors

1. **Add Tutorial**: title required. Duration > 0. Rating must be 1–5. New tutorial defaults to watched=false. Form clears.
2. **Empty title guard**: blank title = no-op.
3. **Mark Watched**: sets watched=true. Button disappears.
4. **Delete**: removes tutorial.
5. **Filter Watched/Unwatched/All**: filters by watched boolean.
6. **Filter Min Rating**: combined with watched filter. Shows tutorials with rating >= selected value. "Any" disables this filter.
7. **Total watch time**: sum of duration for watched=true tutorials only (always unfiltered).

## Edge Cases

- Rating outside 1–5 = no-op on add.
- Duration <= 0 = no-op on add.
- If no tutorials match combined filters, show data-testid="empty-msg" with "No tutorials found".
- Both watched filter and min-rating filter apply simultaneously (AND logic).
