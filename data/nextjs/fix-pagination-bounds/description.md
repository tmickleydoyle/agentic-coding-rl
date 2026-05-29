# Fix: Pagination can scroll past the last page

`components/Paginator.tsx` paginates a fixed list of 12 items, 5 per page. It shows the
current page's items each as `data-testid="row-<value>"`, a page indicator
(`data-testid="page-info"`) formatted as `Page X of Y`, and "Prev"
(`data-testid="prev"`) / "Next" (`data-testid="next"`) buttons.

With 12 items and 5 per page there are 3 pages. On the last page the "Next" button must
be disabled, and on the first page "Prev" must be disabled.

**Bug:** "Next" lets you advance past the last page — clicking it on page 3 moves to a
nonexistent page 4 that renders no rows, and the page indicator goes out of range. The
current page must be clamped to the last page, and "Next" must be disabled there.

Find and fix the bug so paging stays within `[1, totalPages]`. Keep the same
`data-testid` attributes. Default export.
