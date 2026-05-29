# Fix: "Select all" checkbox state doesn't reflect the rows

`components/SelectAll.tsx` is a list of three rows, each with a checkbox
(`data-testid="row-<id>"`), plus a header "select all" checkbox
(`data-testid="select-all"`). Clicking "select all" checks every row; clicking it again
clears them.

The header checkbox must always reflect the rows:
- checked (and NOT indeterminate) when ALL rows are selected,
- unchecked (and NOT indeterminate) when NO rows are selected,
- indeterminate (its `indeterminate` DOM property is `true`) when SOME but not all rows
  are selected.

**Bug:** The header tracks its own boolean that gets out of sync. After "select all",
unchecking one row leaves the header still showing checked (and never indeterminate). The
header's checked/indeterminate state must be DERIVED from the current row selection.

Find and fix the bug. Keep the same `data-testid` attributes. Default export.
