# Build a Reading List App

Build a single-page React application for managing a personal reading list.

## Adding Books

- There is a text input labelled **Book title** and a **Add book** button.
- Clicking **Add book** adds the book to the list with a default status of **Want to read**.
- Adding a blank (empty/whitespace) title does nothing; the input clears after a successful add.

## Book List

Each book entry shows:
- The book's title.
- A `<select>` labelled by the book title (use `aria-label` equal to the book title) with three options: **Want to read**, **Reading**, and **Finished**.
- A **Remove** button that permanently removes the book.

## Filtering

Above the list there are four filter buttons:
- **All** — shows every book (default active filter).
- **Want to read** — shows only books with that status.
- **Reading** — shows only books with that status.
- **Finished** — shows only books with that status.

Only books matching the active filter are rendered in the list.

## Summary Counts

Below the filter buttons, always show a summary line (regardless of active filter) with this exact format:

`Total: 4 | Want to read: 2 | Reading: 1 | Finished: 1`

The numbers update immediately whenever a book is added, removed, or its status changes.

## Finished Percentage

Directly below the summary line, show the finished percentage in this exact format:

`Finished: 25%`

The percentage is `Math.floor((finishedCount / totalCount) * 100)` when there is at least one book, and `Finished: 0%` when the list is empty.

State is kept in memory — no backend or persistence needed.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.