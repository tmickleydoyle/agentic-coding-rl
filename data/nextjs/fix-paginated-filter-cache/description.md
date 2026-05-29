# Fix: Changing the filter shows stale cached rows from the previous filter

`components/PaginatedList.tsx` renders a filtered, paginated list. It takes an `items:
string[]` prop. There is a filter input (`data-testid="filter"`) that keeps only items
whose text includes the filter substring, and pagination with `data-testid="prev"` /
`data-testid="next"` buttons and a `data-testid="page"` indicator (1-based). Each page
shows up to `PAGE_SIZE` (3) rows as `data-testid={`row-${i}`}` (i is the on-page index).

To avoid recomputing slices, the component memoizes each page's rows in a cache.

**Bug:** the cache is keyed by page NUMBER alone and ignores the active filter. After you
change the filter, pages that were already cached under the OLD filter are served from
the cache, so you see stale rows that don't match the new filter (and the page count /
boundaries can be wrong). Changing the filter does not invalidate or re-key the cache.

Fix `components/PaginatedList.tsx` so the cache key incorporates the active filter (or the
cache is invalidated when the filter changes), and so changing the filter resets to page
1. The currently displayed rows must always reflect the current filter. Keep the
`data-testid` attributes and the `PAGE_SIZE` of 3. Default export.
