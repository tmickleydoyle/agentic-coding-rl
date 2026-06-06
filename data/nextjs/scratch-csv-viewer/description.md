# CSV Viewer

Build a single-page CSV viewer that parses comma-separated data and displays it as an interactive table.

## Layout

- A heading "CSV Viewer"
- A textarea labeled "CSV Input" (aria-label="CSV Input") where users paste CSV data
- A "Parse" button that parses the textarea content and renders the table
- A status bar (data-testid="status") showing "X rows, Y columns" after parsing, or "No data" if empty, or "Parse error" if malformed
- A rendered HTML table:
  - First row of CSV is the header row, displayed in `<th>` elements (data-testid="col-header" on each)
  - Subsequent rows are data rows with `<td>` elements (data-testid="cell" on each)
  - Each data row `<tr>` has data-testid="row"
- A search input labeled "Search" (aria-label="Search") that filters rows (live, no button needed). Rows are shown if any cell contains the search string (case-insensitive). Header row is always shown.
- A column sort: clicking a column header `<th>` sorts the table by that column (string comparison, ascending). Clicking the same header again toggles to descending. Show an indicator "▲" or "▼" next to the sorted column header (data-testid="sort-indicator").
- A "Download CSV" button that generates a CSV from the current filtered+sorted table data (including header) and triggers a download of "export.csv".

## Seed Data

Pre-populate the textarea with this CSV string and parse it automatically on initial render:

```
Name,Age,City,Score
Alice,30,New York,95
Bob,25,London,87
Charlie,35,Paris,92
Diana,28,Tokyo,88
Eve,32,Sydney,91
```

## CSV Parsing Rules

- Split by newlines (`\n`), trim each line, skip empty lines.
- Split each line by comma.
- First non-empty line is the header.
- Do not handle quoted fields (simple split by comma is sufficient).

## Behaviors

- Parse button re-parses the textarea content.
- Search filters visible rows in real-time as the user types (does not require Parse).
- Sort state is reset when Parse is clicked.
- "Download CSV" uses a temporary `<a>` element with `href = URL.createObjectURL(new Blob([csvString], { type: 'text/csv' }))` and `download = "export.csv"`, then clicks it programmatically and revokes the URL.
- Show "No data" if textarea is empty or has only whitespace when Parse is clicked.

## Key Data-testids

- data-testid="status"
- data-testid="col-header" (one per column in header row)
- data-testid="row" (one per visible data row)
- data-testid="cell" (one per cell in visible data rows)
- data-testid="sort-indicator" (on the currently sorted column header, if any)
