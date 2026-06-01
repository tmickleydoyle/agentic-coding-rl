# Build a sortable data table

Build a single-page React application that displays a directory of people in a table and lets
the user sort, search, paginate, and select rows.

Seed the app with exactly these 12 people (keep this order as the default, unsorted order):

| Name    | Age | City  |
| ------- | --- | ----- |
| Alice   | 30  | Paris |
| Bob     | 25  | Lyon  |
| Carol   | 35  | Nice  |
| Dave    | 28  | Paris |
| Eve     | 42  | Lyon  |
| Frank   | 22  | Nice  |
| Grace   | 38  | Paris |
| Heidi   | 27  | Lyon  |
| Ivan    | 33  | Nice  |
| Judy    | 29  | Paris |
| Mallory | 45  | Lyon  |
| Niaj    | 24  | Nice  |

What the app should do:

- **Table.** Render a real `<table>` with column headers **Name**, **Age**, and **City**.
- **Sorting.** Each column header is clickable (a button). Clicking it sorts the rows by that
  column ascending; clicking the same header again toggles to descending. Sorting by Age is
  numeric.
- **Search.** A **Search** field filters rows to those whose **name** contains the typed text
  (case-insensitive). Searching resets back to the first page.
- **Pagination.** Show **5 rows per page**. Provide **Previous** and **Next** buttons and a page
  indicator written like `Page 1 of 3`. Previous is disabled on the first page and Next on the
  last. With all 12 people that's 3 pages (5, 5, 2).
- **Selection.** Each row has a checkbox to select it. Show the running count written like
  `Selected: 2`. Selection persists as the user pages and searches.

All state is in memory. Implement the root component as the default export of `app/page.tsx`.
Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
