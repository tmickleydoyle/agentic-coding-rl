# Fix: Reordering an item downward lands it one position off

`components/ReorderList.tsx` renders a reorderable list. It takes an `initialItems:
string[]` prop and keeps the order in state. Each row has `data-testid={`item-${index}`}`
showing the item label, plus a move-up button (`data-testid={`up-${index}`}`) and a
move-down button (`data-testid={`down-${index}`}`). There is also a programmatic
`reorder(from, to)` move used by the buttons (move-up is `reorder(i, i-1)`, move-down is
`reorder(i, i+1)`).

`reorder(from, to)` is meant to remove the item at `from` and insert it so that it ends
up at index `to` in the resulting array.

**Bug:** the implementation splices the element out and then inserts at the raw `to`
index without accounting for the fact that removing an earlier element shifts everything
after it left by one. When moving an item DOWNWARD (`to > from`), the item lands one
position earlier than intended. Moving upward happens to work, which masks the defect.

Find and fix `reorder` so that after `reorder(from, to)` the moved item occupies index
`to` for any valid `from`/`to`, in both directions. Keep the `data-testid` attributes
and props. Default export.
