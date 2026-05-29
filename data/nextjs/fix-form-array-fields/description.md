# Fix: Removing a middle row shifts values onto the wrong rows

`components/FieldArray.tsx` is a dynamic form with a variable number of text rows. There
is an "Add" button (`data-testid="add"`) that appends a new empty row, and each row has a
text input (`data-testid={`field-${i}`}`) and a remove button
(`data-testid={`remove-${i}`}`), where `i` is the row's position. A summary element
`data-testid="values"` shows the current values joined by `,`.

The component starts with one empty row.

**Bug:** the per-row value state is keyed by the row's array INDEX. When a row in the
MIDDLE is removed, every row after it shifts up by one index, so the surviving rows read
their values from the wrong (now shifted) keys. The result is that the removed row's
value appears to "stick" to its old position while the rows below display the wrong text.

Fix `components/FieldArray.tsx` so each row carries a STABLE identity (e.g. a unique id
assigned at creation) and its value is keyed by that id, so removing any row leaves the
other rows' values intact and correctly positioned. Keep the `data-testid` attributes
(indices still reflect current display position). Default export.
