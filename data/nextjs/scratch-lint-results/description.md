# Lint Results

Build a single-page React app for viewing and managing linting results from code analysis.

## Seed Data

| id | file                          | rule                   | level   | line | message                              | suppressed |
|----|-------------------------------|------------------------|---------|------|--------------------------------------|------------|
| 1  | src/auth/login.ts             | no-unused-vars         | warning | 14   | 'token' is defined but never used    | false      |
| 2  | src/auth/login.ts             | no-explicit-any        | error   | 22   | Unexpected any. Specify a type       | false      |
| 3  | src/components/Button.tsx     | react-hooks/exhaustive-deps | warning | 8 | Missing dependency 'onClick'        | true       |
| 4  | src/utils/format.ts           | no-console             | warning | 31   | Unexpected console statement         | false      |
| 5  | src/api/client.ts             | no-explicit-any        | error   | 5    | Unexpected any. Specify a type       | false      |
| 6  | src/api/client.ts             | prefer-const           | warning | 18   | 'response' is never reassigned       | true       |
| 7  | src/components/Modal.tsx      | no-unused-vars         | error   | 45   | 'props' is defined but never used    | false      |

## Fields

- **file**: string — file path
- **rule**: string — lint rule name
- **level**: "error" | "warning"
- **line**: number — line number
- **message**: string
- **suppressed**: boolean — whether this result is suppressed/ignored

## Behaviors

### Display
- Heading "Lint Results".
- Render each result as a row in a table with columns: File, Rule, Level, Line, Message, Suppressed, Actions.
- Each row: `data-testid="lint-row-{id}"`.
- Level cell: `data-testid="level-{id}"`.
- Line cell: `data-testid="line-{id}"`.
- Suppressed badge: `data-testid="suppressed-badge-{id}"` showing "Suppressed" only when suppressed=true.

### Add Result
- Form with: file (text, `data-testid="input-file"`), rule (text, `data-testid="input-rule"`), level (select, `data-testid="select-level"` options error/warning), line (number, `data-testid="input-line"`), message (text, `data-testid="input-message"`).
- Submit button `data-testid="btn-add-result"` labeled "Add Result".
- Auto-increment id, suppressed defaults to false.
- Do not submit if file or message is empty.

### Suppress Toggle
- Each row has `data-testid="btn-suppress-{id}"` labeled "Suppress" when not suppressed, "Unsuppress" when suppressed.
- Clicking toggles suppressed state.

### Filter by Level
- Buttons: "All" (`data-testid="filter-all"`), "Errors" (`data-testid="filter-error"`), "Warnings" (`data-testid="filter-warning"`).

### Filter by Suppressed
- Buttons: "Show All" (`data-testid="filter-show-all"`), "Active Only" (`data-testid="filter-active"`), "Suppressed Only" (`data-testid="filter-suppressed"`).
- "Active Only" shows only suppressed=false; "Suppressed Only" shows suppressed=true.
- Both filters (level and suppressed) apply simultaneously.

### Summary Stats
- `data-testid="stat-total"` — total results.
- `data-testid="stat-errors"` — count of error level results.
- `data-testid="stat-warnings"` — count of warning level results.
- `data-testid="stat-suppressed"` — count of suppressed results.

### Delete
- Each row has `data-testid="btn-delete-{id}"`.

## Edge Cases
- Empty file or message: no row added.
- Stats always reflect all entries regardless of filters.
- Newly added results start unsuppressed.
