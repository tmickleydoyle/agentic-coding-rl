# Package Compare

Build a single-page Package Compare app that lets users compare npm packages side by side based on key metrics.

## Seed Data

```ts
const PACKAGES = [
  { id: 1, name: "lodash", weeklyDownloads: 45000000, stars: 58000, openIssues: 120, lastPublished: "2023-06-01", license: "MIT", size: 71 },
  { id: 2, name: "underscore", weeklyDownloads: 8000000, stars: 27000, openIssues: 85, lastPublished: "2023-01-15", license: "MIT", size: 55 },
  { id: 3, name: "ramda", weeklyDownloads: 3000000, stars: 23000, openIssues: 210, lastPublished: "2023-09-10", license: "MIT", size: 43 },
  { id: 4, name: "date-fns", weeklyDownloads: 22000000, stars: 33000, openIssues: 95, lastPublished: "2023-10-05", license: "MIT", size: 78 },
  { id: 5, name: "moment", weeklyDownloads: 15000000, stars: 47000, openIssues: 310, lastPublished: "2022-11-20", license: "MIT", size: 300 },
  { id: 6, name: "axios", weeklyDownloads: 50000000, stars: 103000, openIssues: 520, lastPublished: "2023-11-01", license: "MIT", size: 14 },
]
```

## Fields

- **id**: unique number
- **name**: package name
- **weeklyDownloads**: number
- **stars**: GitHub star count
- **openIssues**: open GitHub issues count
- **lastPublished**: ISO date string
- **license**: license identifier
- **size**: install size in KB

## UI Requirements

1. Page heading "Package Compare" (`data-testid="heading"`).
2. Display all packages in a list. Each item has:
   - `data-testid="pkg-item-{id}"` on the container
   - `data-testid="pkg-name-{id}"` showing the name
   - `data-testid="pkg-downloads-{id}"` showing weeklyDownloads
   - `data-testid="pkg-stars-{id}"` showing stars
   - `data-testid="pkg-size-{id}"` showing size (as number, e.g. "14")
3. Sort control: `<select>` (`data-testid="sort-select"`) with options:
   - "downloads" — sort descending by weeklyDownloads
   - "stars" — sort descending by stars
   - "size" — sort ascending by size
   - "issues" — sort ascending by openIssues
   Default: "downloads".
4. The list is always sorted by the selected criterion.
5. Selection: each item has a checkbox `data-testid="select-{id}"`. User can select up to 2 packages for comparison.
6. If user tries to select a third package while 2 are already selected, do nothing (keep existing 2 selected).
7. Comparison panel: when exactly 2 packages are selected, show `data-testid="compare-panel"` with:
   - `data-testid="compare-winner-downloads"` — name of package with higher weeklyDownloads
   - `data-testid="compare-winner-stars"` — name of package with more stars
   - `data-testid="compare-winner-size"` — name of package with smaller size (lower is better)
8. When fewer than 2 selected, hide the compare panel (not in DOM or hidden).
9. "Clear selection" button `data-testid="clear-selection"` unchecks all checkboxes.

## Edge Cases

- Sorting changes display order but does not affect selection.
- When one of the 2 selected packages is deselected, the compare panel disappears.
- The compare panel reappears when exactly 2 are selected again.
