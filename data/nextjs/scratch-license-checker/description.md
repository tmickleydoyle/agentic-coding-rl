# License Checker

Build a single-page License Checker app that tracks open-source licenses used by project dependencies.

## Seed Data

```ts
const PACKAGES = [
  { id: 1, name: "react", version: "18.2.0", license: "MIT", approved: true },
  { id: 2, name: "redux", version: "4.2.1", license: "MIT", approved: true },
  { id: 3, name: "gpl-lib", version: "1.0.0", license: "GPL-3.0", approved: false },
  { id: 4, name: "apache-utils", version: "2.1.0", license: "Apache-2.0", approved: true },
  { id: 5, name: "commons-io", version: "3.0.0", license: "LGPL-2.1", approved: false },
  { id: 6, name: "uuid", version: "9.0.0", license: "MIT", approved: true },
  { id: 7, name: "bcrypt", version: "5.1.0", license: "Apache-2.0", approved: true },
  { id: 8, name: "mystery-pkg", version: "0.0.1", license: "Unknown", approved: false },
]
```

## Fields

- **id**: unique number
- **name**: package name
- **version**: semver string
- **license**: license identifier string
- **approved**: boolean — whether this license is approved for use

## UI Requirements

1. Page heading "License Checker" (`data-testid="heading"`).
2. Display all packages in a list. Each item has:
   - `data-testid="pkg-item-{id}"` on the container
   - `data-testid="pkg-name-{id}"` showing the name
   - `data-testid="pkg-license-{id}"` showing the license
   - `data-testid="pkg-approved-{id}"` showing "Approved" if approved, "Rejected" if not
3. Filter buttons: "All" (`data-testid="filter-all"`), "Approved" (`data-testid="filter-approved"`), "Rejected" (`data-testid="filter-rejected"`). Default "All".
4. License type filter: `<select>` (`data-testid="license-select"`) with options "All" plus each distinct license in the seed data. Default "All".
5. Filters combine with AND logic.
6. Count: `data-testid="pkg-count"` shows "{n} packages".
7. Summary:
   - `data-testid="count-approved"` shows number of approved packages in current filtered view
   - `data-testid="count-rejected"` shows number of rejected packages in current filtered view
8. Toggle approval: each item has button `data-testid="toggle-{id}"`. Clicking flips the `approved` boolean for that package.
9. Add package form: text input `data-testid="add-name"`, text input `data-testid="add-license"`, button `data-testid="add-button"`. New packages default to `approved: false`. Name must be non-empty; if empty, do nothing. Added packages get next available id and version "0.0.0".
10. Remove: each item has button `data-testid="remove-{id}"`. Clicking removes the package.

## Edge Cases

- After toggling, filters re-apply so a toggled item may disappear from filtered view.
- Adding with empty name does nothing.
- License select should reflect distinct licenses from current package list (not just seed); use seed license list as fixed options for simplicity.
