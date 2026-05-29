export type CellId = string
export type Cells = Record<CellId, string>

export const COLS = ['A', 'B', 'C'] as const
export const ROWS = [1, 2, 3] as const

export const ALL_IDS: CellId[] = ROWS.flatMap((r) => COLS.map((c) => `${c}${r}`))

const REF_RE = /^[A-C][1-3]$/

export function parseFormula(
  src: string
): { refs: string[]; tokens: { ref: string; sign: 1 | -1 }[] } | null {
  if (!src.startsWith('=')) return null
  const body = src.slice(1).replace(/\s+/g, '')
  if (body.length === 0) return null

  const tokens: { ref: string; sign: 1 | -1 }[] = []
  let sign: 1 | -1 = 1
  let cur = ''
  let expectTerm = true

  const flush = (): boolean => {
    if (!REF_RE.test(cur)) return false
    tokens.push({ ref: cur, sign })
    cur = ''
    return true
  }

  for (const ch of body) {
    if (ch === '+' || ch === '-') {
      if (expectTerm) {
        // leading sign on a term
        if (cur.length > 0) return null
        sign = ch === '-' ? -1 : 1
        continue
      }
      if (!flush()) return null
      sign = ch === '-' ? -1 : 1
      expectTerm = true
    } else {
      cur += ch
      expectTerm = false
    }
  }
  if (expectTerm) return null // trailing operator
  if (!flush()) return null

  return { refs: tokens.map((t) => t.ref), tokens }
}

function evalId(
  cells: Cells,
  id: CellId,
  stack: Set<CellId>
): number | null {
  if (stack.has(id)) return null // cycle
  const raw = (cells[id] ?? '').trim()
  if (raw === '') return 0

  if (!raw.startsWith('=')) {
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  }

  const parsed = parseFormula(raw)
  if (!parsed) return null

  stack.add(id)
  let sum = 0
  for (const t of parsed.tokens) {
    if (!REF_RE.test(t.ref)) {
      stack.delete(id)
      return null
    }
    const v = evalId(cells, t.ref, stack)
    if (v === null) {
      stack.delete(id)
      return null
    }
    sum += t.sign * v
  }
  stack.delete(id)
  return sum
}

export function evaluate(cells: Cells, id: CellId): number | null {
  return evalId(cells, id, new Set())
}

export function computeAll(cells: Cells): Record<CellId, number | null> {
  const out: Record<CellId, number | null> = {}
  for (const id of ALL_IDS) out[id] = evaluate(cells, id)
  return out
}
