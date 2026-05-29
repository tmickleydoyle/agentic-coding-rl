# Fix: Calendar dates land under the wrong weekday columns

`components/CalendarGrid.tsx` renders a month as a grid of weeks. It takes props `year:
number` and `month: number` (1-based: `1` = January … `12` = December). Weeks are
Sunday-first (column 0 = Sunday … column 6 = Saturday).

Each day cell that holds a real date has `data-testid={`cell-${week}-${weekday}`}` and
renders the day-of-month number as its text, where `week` is the 0-based week row and
`weekday` is the 0-based column (Sunday=0). Leading cells before the 1st and trailing
cells after the last day are blank (rendered, but with no day number / empty text).

**Bug (two related defects):**

1. The leading blank offset for the 1st of the month is computed wrong, so every date is
   shifted into the wrong weekday column (e.g. off by one, or it forgets that
   `getDay()` is already Sunday-based).
2. The number of days in the month is computed with a lookup that mishandles February in
   a leap year (returns 28 instead of 29), so the last day of a leap-year February is
   missing.

Fix `components/CalendarGrid.tsx` so each date appears in the correct `(week, weekday)`
cell for any month, and a leap-year February has 29 days. Keep the `data-testid`
scheme and props. Default export.
