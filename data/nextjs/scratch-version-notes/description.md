# Version Notes

Build a single-page Version Notes (changelog) app that tracks release notes for software packages.

## Seed Data

```ts
const RELEASES = [
  { id: 1, version: "3.0.0", package: "myapp", type: "major", date: "2023-11-01", notes: "Complete rewrite with new architecture", breaking: true },
  { id: 2, version: "2.5.0", package: "myapp", type: "minor", date: "2023-09-15", notes: "Added dark mode support", breaking: false },
  { id: 3, version: "2.4.2", package: "myapp", type: "patch", date: "2023-08-10", notes: "Fixed memory leak in parser", breaking: false },
  { id: 4, version: "2.4.1", package: "myapp", type: "patch", date: "2023-07-05", notes: "Fixed null pointer exception", breaking: false },
  { id: 5, version: "1.0.0", package: "plugin-a", type: "major", date: "2023-06-01", notes: "Initial stable release", breaking: false },
  { id: 6, version: "0.9.0", package: "plugin-a", type: "minor", date: "2023-05-10", notes: "Beta feature additions", breaking: false },
  { id: 7, version: "2.0.0", package: "plugin-b", type: "major", date: "2023-10-20", notes: "Breaking API changes for v2", breaking: true },
  { id: 8, version: "1.2.0", package: "plugin-b", type: "minor", date: "2023-04-15", notes: "New event hooks", breaking: false },
]
```

## Fields

- **id**: unique number
- **version**: semver string
- **package**: package name string
- **type**: "major" | "minor" | "patch"
- **date**: ISO date string
- **notes**: release notes text
- **breaking**: boolean — whether this release contains breaking changes

## UI Requirements

1. Page heading "Version Notes" (`data-testid="heading"`).
2. Display all releases in a list sorted by date descending (newest first). Each item has:
   - `data-testid="release-item-{id}"` on the container
   - `data-testid="release-version-{id}"` showing the version
   - `data-testid="release-package-{id}"` showing the package name
   - `data-testid="release-type-{id}"` showing the type
   - `data-testid="release-breaking-{id}"` showing "Breaking" if breaking is true, "Safe" if false
3. Filter by type: buttons "All" (`data-testid="filter-all"`), "major" (`data-testid="filter-major"`), "minor" (`data-testid="filter-minor"`), "patch" (`data-testid="filter-patch"`). Default "All".
4. Filter by package: `<select>` (`data-testid="package-select"`) with options "All" plus each distinct package name. Default "All".
5. Checkbox "Breaking only" (`data-testid="breaking-checkbox"`). When checked, show only releases where breaking === true.
6. All three filters combine with AND logic.
7. Count: `data-testid="release-count"` shows "{n} releases".
8. Add release form:
   - Text input `data-testid="add-version"` for version
   - Select `data-testid="add-package"` with options for each distinct package from seed data
   - Select `data-testid="add-type"` with options major/minor/patch
   - Text input `data-testid="add-notes"` for notes
   - Button `data-testid="add-button"` to submit
   - New release uses today's date ("2023-12-01" fixed constant for testing), `breaking: false`, and next available id.
   - Version must be non-empty; if empty, do nothing.
9. Delete: each item has button `data-testid="delete-{id}"` that removes the release.

## Edge Cases

- List always stays sorted newest-first regardless of add order (added items use fixed date "2023-12-01" which is newest).
- Deleting all releases shows "0 releases".
- Filters update count correctly after add/delete.
