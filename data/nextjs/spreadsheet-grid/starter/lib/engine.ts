export type CellId = string
export type Cells = Record<CellId, string>

export const COLS = ['A', 'B', 'C'] as const
export const ROWS = [1, 2, 3] as const
export const ALL_IDS: CellId[] = ROWS.flatMap((r) => COLS.map((c) => `${c}${r}`))

// TODO: parse a string beginning with '=' into signed cell-ref terms (A-C / 1-3), separated by
// +/- with an optional leading sign; return null on any grammar violation (number literals,
// unknown tokens, empty body, trailing operator). Whitespace is ignored.
export function parseFormula(
  src: string
): { refs: string[]; tokens: { ref: string; sign: 1 | -1 }[] } | null {
  return null
}

// TODO: empty/missing -> 0; non-formula -> Number(raw) or null if not finite; formula -> parse,
// null on parse failure / out-of-range ref / null sub-evaluation / cycle; else sum signed terms.
export function evaluate(cells: Cells, id: CellId): number | null {
  return null
}

// TODO: evaluate every id A1..C3.
export function computeAll(cells: Cells): Record<CellId, number | null> {
  const out: Record<CellId, number | null> = {}
  for (const id of ALL_IDS) out[id] = null
  return out
}
