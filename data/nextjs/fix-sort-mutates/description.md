# Fix: Sorting the list mutates the caller's array

`components/SortedList.tsx` takes a `rows: number[]` prop and a Sort button
(`data-testid="sort"`). Clicking Sort displays the rows in ascending order inside
`data-testid="sorted"` (a comma-joined string, e.g. `1, 2, 3`).

It must NOT modify the array it was given — sorting should operate on a copy.

`components/SortDemo.tsx` is the harness: it keeps an `original` array `[3, 1, 2]`,
renders `SortedList` with it, and also renders the original array verbatim in
`data-testid="original"` (e.g. `3, 1, 2`). The original display must stay `3, 1, 2`
no matter how many times Sort is clicked.

**Bug:** `SortedList` calls `.sort()` directly on the `rows` prop, which sorts the
array in place. After clicking Sort, the harness's `original` display also changes to
sorted order, because both views share the same array reference.

Fix `SortedList` so it sorts a copy and leaves the input array untouched. Keep the same
`data-testid` attributes. Both files use default exports.
