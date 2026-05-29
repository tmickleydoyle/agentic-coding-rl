# Virtual scroll list

A windowed (virtualized) list that renders **only the rows visible for the current scroll
position** (plus a small overscan), so a 10,000-item list mounts only a handful of DOM nodes.
This task spans **4 files**.

jsdom has no layout engine: row and viewport heights come from **props**, and scrolling is
simulated by firing a scroll event whose target has a `scrollTop`.

- `components/types.ts` — exports:
  - `type Row<T> = { index: number; item: T; top: number }` (the windowed row descriptor).
  - `const OVERSCAN = 2` (extra rows rendered above and below the window).

- `hooks/useVirtual.ts` — exports `useVirtual<T>(items: T[], rowHeight: number, viewportHeight: number)`
  returning `{ scrollTop, onScroll, totalHeight, rows }`:
  - `scrollTop: number` starts at `0`. `onScroll(e: UIEvent<HTMLDivElement>)` sets it to
    `e.currentTarget.scrollTop`.
  - `totalHeight = items.length * rowHeight`.
  - The visible window: `first = floor(scrollTop / rowHeight)`, `visibleCount = ceil(viewportHeight / rowHeight)`.
    Apply overscan and clamp to bounds: `start = max(0, first - OVERSCAN)`,
    `end = min(items.length - 1, first + visibleCount - 1 + OVERSCAN)` (inclusive).
  - `rows: Row<T>[]` is one entry per index from `start` to `end` inclusive, each
    `{ index: i, item: items[i], top: i * rowHeight }`. If `items` is empty, `rows` is `[]`.

- `components/RowView.tsx` — accepts `{ index: number; top: number; height: number; children: ReactNode }`.
  Renders a `<div data-testid={`row-${index}`}>` absolutely positioned with inline style
  `{ position: 'absolute', top, height }`, containing `children`.

- `components/VirtualList.tsx` (entry, default export) — accepts
  `{ items: string[]; rowHeight: number; viewportHeight: number }`. Uses `useVirtual` and renders:
  - an outer `<div data-testid="viewport">` with inline style `{ height: viewportHeight, overflowY: 'auto', position: 'relative' }`
    and `onScroll` wired to the hook.
  - an inner spacer `<div data-testid="spacer">` with inline style `{ height: totalHeight, position: 'relative' }`.
  - inside the spacer, one `<RowView>` per windowed row (key by index), rendering the string item as its child.
