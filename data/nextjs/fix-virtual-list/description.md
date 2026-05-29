# Fix: Virtual list drops the last visible row after scrolling

`components/VirtualList.tsx` is a windowed (virtualized) list. It takes props:

- `items: string[]` — the full data set.
- `rowHeight: number` — the fixed pixel height of each row.
- `viewportHeight: number` — the pixel height of the scroll container.

It renders a scroll container (`data-testid="viewport"`) whose inner content has a total
height of `items.length * rowHeight`, and renders ONLY the rows that fall inside the
current scroll window. Each rendered row has `data-testid={`row-${index}`}` and shows the
item text. The component tracks `scrollTop` in state and updates it from the viewport's
`onScroll` handler (reading `e.currentTarget.scrollTop`).

**Bug:** the visible-range math is wrong. The end index is computed by flooring
`(scrollTop + viewportHeight) / rowHeight`, which drops the final partially-visible row,
and the range is treated as exclusive of that index. As a result the bottom row that
should be visible in the window is missing, and after scrolling the wrong set of rows is
rendered (you can see a row testid that should be present is absent).

Find and fix the range computation so that every row overlapping the
`[scrollTop, scrollTop + viewportHeight)` window is rendered — including a partially
visible last row — and no extra rows beyond the data bounds. Keep the same `data-testid`
attributes and props. Default export.
