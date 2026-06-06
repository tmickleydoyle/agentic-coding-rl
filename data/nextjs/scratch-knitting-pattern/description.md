# Knitting Pattern Manager

A single-page React app to manage a collection of knitting patterns.

## Seed Data

Start with these 4 patterns pre-loaded:

| id | name | yarn | needleSize | rows | status |
|----|------|------|------------|------|--------|
| 1 | "Cozy Scarf" | "Merino Wool" | "5mm" | 120 | "active" |
| 2 | "Baby Blanket" | "Cotton Blend" | "4mm" | 200 | "active" |
| 3 | "Winter Hat" | "Alpaca" | "6mm" | 80 | "complete" |
| 4 | "Fingerless Gloves" | "Sock Yarn" | "2.5mm" | 60 | "complete" |

## Fields

- **name** (string): pattern name
- **yarn** (string): yarn type used
- **needleSize** (string): e.g. "4mm"
- **rows** (number): total row count
- **status**: "active" | "complete"

## UI Layout

- Page heading: "Knitting Pattern Manager"
- **Add Pattern form** with inputs:
  - text input labeled "Pattern Name" (data-testid="input-name")
  - text input labeled "Yarn Type" (data-testid="input-yarn")
  - text input labeled "Needle Size" (data-testid="input-needle")
  - number input labeled "Row Count" (data-testid="input-rows")
  - submit button "Add Pattern" (data-testid="btn-add")
- **Filter bar**: three buttons "All" / "Active" / "Complete" (data-testid="filter-all", "filter-active", "filter-complete")
- **Pattern list**: each pattern in a card with:
  - data-testid="pattern-{id}" on the card element
  - data-testid="pattern-name-{id}" showing the name
  - data-testid="pattern-yarn-{id}" showing yarn
  - data-testid="pattern-needle-{id}" showing needle size
  - data-testid="pattern-rows-{id}" showing row count
  - data-testid="pattern-status-{id}" showing status badge ("active" or "complete")
  - A button "Mark Complete" (data-testid="btn-complete-{id}") — only visible when status is "active"
  - A button "Delete" (data-testid="btn-delete-{id}")
- **Summary line** (data-testid="summary"): "X patterns (Y active, Z complete)"

## Behaviors

1. **Add Pattern**: fill all 4 fields and click "Add Pattern". New pattern is appended with status "active". Form clears after submit. Rows must be a positive number.
2. **Empty name guard**: if Pattern Name is blank, do not add.
3. **Mark Complete**: clicking "Mark Complete" changes status from "active" to "complete". The button disappears.
4. **Delete**: removes the pattern from the list.
5. **Filter All**: shows all patterns (default).
6. **Filter Active**: shows only status="active" patterns.
7. **Filter Complete**: shows only status="complete" patterns.
8. **Summary**: always reflects current totals regardless of active filter.

## Edge Cases

- Deleting a pattern does not shift IDs of remaining patterns.
- If no patterns match the active filter, show a div with data-testid="empty-msg" containing "No patterns found".
- Row count of 0 or negative should not be added (treat same as blank name: no-op).
