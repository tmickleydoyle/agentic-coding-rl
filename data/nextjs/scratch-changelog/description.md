# Changelog Viewer

A single-page changelog management app for tracking version history entries.

## Seed Data

Four changelog entries pre-loaded:
1. id:1, version:"1.0.0", date:"2024-01-15", type:"major", summary:"Initial public release"
2. id:2, version:"1.1.0", date:"2024-02-20", type:"minor", summary:"Added dark mode support"
3. id:3, version:"1.1.1", date:"2024-03-05", type:"patch", summary:"Fixed login redirect bug"
4. id:4, version:"1.2.0", date:"2024-04-10", type:"minor", summary:"New dashboard widgets"

## Layout

- Heading: "Changelog"
- Summary counts (data-testid):
  - `count-major`: number of major entries
  - `count-minor`: number of minor entries
  - `count-patch`: number of patch entries

## Add Entry Form

Fields:
- Text input, aria-label "Version" — e.g. 2.0.0
- Text input, aria-label "Date" — e.g. 2024-05-01
- Select, aria-label "Type" — options: major, minor, patch (default: minor)
- Text input, aria-label "Summary" — short description of changes

Button "Add Entry": adds entry. Clears fields (type resets to minor). Does nothing if version is empty.

## Entry List

Entries rendered in reverse order (most recently added first — newest id at top).

Each entry rendered with:
- `data-testid="entry-item"` on the container
- `data-testid="entry-version"` showing the version string
- `data-testid="entry-date"` showing the date
- `data-testid="entry-type"` showing the type (major/minor/patch)
- `data-testid="entry-summary"` showing the summary

## Filter by Type

A select with aria-label "Filter by type" — options: All, major, minor, patch. Default "All".
Shows only entries of the selected type.

## Delete

Each entry has a "Delete" button to remove it.

## Edge Cases

- Adding with empty version does nothing.
- Counts always reflect global totals regardless of filter.
- Entries are shown newest-first (reverse insertion order).
