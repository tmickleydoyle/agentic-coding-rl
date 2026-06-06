# Dependency Audit

Build a single-page Dependency Audit app that tracks npm package dependencies and their vulnerability status.

## Seed Data

```ts
const PACKAGES = [
  { id: 1, name: "lodash", version: "4.17.21", type: "production", severity: "none", outdated: false },
  { id: 2, name: "axios", version: "0.21.1", type: "production", severity: "high", outdated: true },
  { id: 3, name: "jest", version: "27.0.0", type: "dev", severity: "none", outdated: true },
  { id: 4, name: "express", version: "4.18.2", type: "production", severity: "medium", outdated: false },
  { id: 5, name: "eslint", version: "8.0.0", type: "dev", severity: "none", outdated: false },
  { id: 6, name: "moment", version: "2.29.1", type: "production", severity: "low", outdated: true },
  { id: 7, name: "webpack", version: "5.75.0", type: "dev", severity: "none", outdated: false },
  { id: 8, name: "react-scripts", version: "5.0.0", type: "dev", severity: "critical", outdated: true },
]
```

## Fields

- **id**: unique number
- **name**: package name
- **version**: semver string
- **type**: "production" or "dev"
- **severity**: "none" | "low" | "medium" | "high" | "critical"
- **outdated**: boolean

## UI Requirements

1. Page heading "Dependency Audit" (`data-testid="heading"`).
2. Display all packages in a list. Each item has:
   - `data-testid="pkg-item-{id}"` on the container
   - `data-testid="pkg-name-{id}"` showing the name
   - `data-testid="pkg-version-{id}"` showing the version
   - `data-testid="pkg-severity-{id}"` showing the severity
   - `data-testid="pkg-type-{id}"` showing the type
3. Filter by type: buttons "All" (`data-testid="filter-all"`), "production" (`data-testid="filter-production"`), "dev" (`data-testid="filter-dev"`). Default "All".
4. Filter by severity: a `<select>` (`data-testid="severity-select"`) with options "All", "none", "low", "medium", "high", "critical". Default "All".
5. Checkbox "Outdated only" (`data-testid="outdated-checkbox"`). When checked, show only packages where `outdated === true`.
6. All three filters combine with AND logic.
7. Count: `data-testid="pkg-count"` shows "{n} packages".
8. Summary bar:
   - `data-testid="count-critical"` shows number of critical-severity packages in current filtered view
   - `data-testid="count-outdated"` shows number of outdated packages in current filtered view
9. Mark resolved: each item has button `data-testid="resolve-{id}"`. Clicking sets severity to "none" for that package.
10. Remove package: each item has button `data-testid="remove-{id}"`. Clicking removes the package.

## Edge Cases

- Resolve does not remove the package, only changes severity to "none".
- Filters update summary counts correctly.
- Removing all packages shows "0 packages".
