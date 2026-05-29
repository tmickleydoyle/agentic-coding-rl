# Command palette

A keyboard-driven command palette: an input filters a list of commands by case-insensitive
substring, results are grouped by category, ArrowUp/Down move a highlight (wrapping) over the
**commands only** (never the group headers), Enter runs the highlighted command, Escape clears
the query. This task spans **4 files**.

- `components/types.ts` — exports:
  - `type Command = { id: string; label: string; category: string; run: () => void }`.

- `hooks/usePalette.ts` — exports `usePalette(commands: Command[])` returning
  `{ query, setQuery, results, groups, highlight, moveUp, moveDown, run }`:
  - `query: string` (starts `''`). `setQuery(value)` updates it **and resets `highlight` to `0`**.
  - `results: Command[]` — commands whose `label` contains `query` as a case-insensitive substring
    (empty query keeps all), preserving the input order.
  - `groups: { category: string; commands: Command[] }[]` — `results` grouped by `category`, in the
    order each category first appears in `results`.
  - `highlight: number` (starts `0`) — an index into `results` (the **flat** filtered list, ignoring
    group boundaries). `moveDown()` / `moveUp()` move it by one, wrapping modulo `results.length`.
    When `results` is empty, `highlight` stays `0` and the moves are no-ops.
  - `run()` — if `results` is non-empty, calls `results[highlight].run()`.

- `components/CommandItem.tsx` — accepts `{ command: Command; active: boolean; onRun: () => void }`.
  Renders `<button data-testid={`cmd-${command.id}`}>` with the label, `aria-selected={active}`,
  calling `onRun` on click.

- `components/CommandPalette.tsx` (entry, default export) — accepts `{ commands: Command[] }`.
  Uses `usePalette` and renders:
  - `<input data-testid="palette-input">` bound to `query`; on key events:
    ArrowDown -> `moveDown`, ArrowUp -> `moveUp` (both `preventDefault`), Enter -> `run`,
    Escape -> `setQuery('')`.
  - For each group, a `<div data-testid={`group-${category}`}>` containing a header
    `<div data-testid={`group-header-${category}`}>{category}</div>` followed by a `<CommandItem>`
    per command. `active` is true for the command at the flat `highlight` index. Clicking an item
    runs that command via its own `run`.
  - When `results` is empty, render `<div data-testid="empty">No commands</div>` instead of groups.
