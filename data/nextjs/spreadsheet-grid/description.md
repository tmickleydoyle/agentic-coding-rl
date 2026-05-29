# Spreadsheet grid with a mini formula engine

A 3x3 grid of cells `A1..C3` (columns `A,B,C`, rows `1,2,3`). Each cell's **raw** value is a string
that is either a literal number (e.g. `"12"`, `"-3"`, `"2.5"`) or a **formula** beginning with `=`
that references other cells and combines them with `+` and `-` (e.g. `"=A1+B2"`, `"=A1-A2-A3"`).
Editing a cell recomputes the displayed value of all cells, so dependents update live. The
displayed value is `#ERR` for a bad reference, a non-numeric operand, or a reference cycle.

This task spans **4 files**; the engine is the centerpiece.

- `lib/engine.ts` — a pure (no React) formula engine:
  - `type CellId = string` (e.g. `"A1"`), `type Cells = Record<CellId, string>` (raw values; a
    missing or empty entry is treated as the literal `0`).
  - `parseFormula(src: string): { refs: string[]; tokens: { ref: string; sign: 1 | -1 }[] } | null`
    — for a string beginning with `=`, parse the body into signed terms. Each term is a cell ref like
    `A1` (one letter `A-C`, one digit `1-3`), separated by `+`/`-`; a leading sign is allowed (the
    first term defaults to `+`). Returns `null` if the body doesn't match this grammar (e.g. contains
    a number literal, an unknown token, or is empty). Whitespace around tokens is ignored.
  - `evaluate(cells: Cells, id: CellId): number | null` — compute the numeric value of `id`:
    - If the raw value is empty/missing -> `0`.
    - If it does NOT start with `=`: parse it as a number; return `null` if it isn't a finite number.
    - If it starts with `=`: parse via `parseFormula`; return `null` if parsing fails, if any ref is
      out of the `A1..C3` range, or if evaluating any ref returns `null`. Otherwise sum the signed
      terms.
    - Detect cycles: if a cell is (transitively) part of its own evaluation, return `null`.
  - `computeAll(cells: Cells): Record<CellId, number | null>` — `evaluate` for every id `A1..C3`.

- `hooks/useSheet.ts` — exports `useSheet(initial: Cells)` returning
  `{ raw, computed, setCell }`:
  - `raw: Cells` (current raw strings, starting from `initial`).
  - `computed: Record<CellId, number | null>` — `computeAll(raw)`.
  - `setCell(id: CellId, value: string)` — update one raw cell (recompute is automatic via `computed`).

- `components/Cell.tsx` — accepts `{ id: CellId; raw: string; value: number | null; onChange: (v: string) => void }`.
  Renders an `<input data-testid={`input-${id}`}>` bound to `raw` (calls `onChange` on change) and a
  `<span data-testid={`value-${id}`}>` showing the computed value, or `#ERR` when `value` is `null`.

- `components/Spreadsheet.tsx` (entry, default export) — accepts `{ initial?: Cells }` (default `{}`).
  Uses `useSheet` and renders a `<div data-testid="grid">` with a `<Cell>` for every id `A1..C3`,
  wiring `onChange` to `setCell`.
