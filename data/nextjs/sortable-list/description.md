# Sortable list

Implement a client component `SortableList` in `components/SortableList.tsx`:

- Accepts `items: string[]`.
- Renders `<ul data-testid="list">` with one `<li>` per item.
- Renders `<button data-testid="sort">` with label `"Sort A→Z"` initially.
- Renders `<span data-testid="order">` showing the current order: `"original"`, `"asc"`, or `"desc"`.
- Initial state: items shown **in the original order from props**; order = `"original"`.
- Clicks cycle through: original → asc (A→Z) → desc (Z→A) → original (repeat).
- The button label updates to describe the **next** click: after going to "asc", the button says `"Sort Z→A"`; after "desc", it says `"Original order"`; after "original", it says `"Sort A→Z"`.

Default export.
