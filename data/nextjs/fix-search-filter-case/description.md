# Fix: Search filter is case-sensitive

`components/SearchFilter.tsx` shows a text input (`data-testid="query"`) and a list of
fruit names. As you type, the list (`data-testid="results"`) should show only the items
whose name contains the typed query as a substring, ignoring letter case. Each visible
item is rendered as `data-testid="item-<name>"`.

**Bug:** The filter is case-SENSITIVE. Typing `ap` matches `apple` but typing `AP` (or
`Ap`) matches nothing, even though it should still match `apple`. Matching should be
case-insensitive in both directions.

Find and fix the bug so the filter does a case-insensitive substring match. Keep the
same `data-testid` attributes. Default export.
