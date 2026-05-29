import type { Person, SortEntry, SortKey } from '../components/types'

export function cycleSort(sorts: SortEntry[], key: SortKey): SortEntry[] {
  const idx = sorts.findIndex((s) => s.key === key)
  if (idx === -1) {
    return [...sorts, { key, dir: 'asc' }]
  }
  const cur = sorts[idx]
  if (cur.dir === 'asc') {
    const next = [...sorts]
    next[idx] = { key, dir: 'desc' }
    return next
  }
  // was desc -> remove
  return sorts.filter((s) => s.key !== key)
}

function compareBy(a: Person, b: Person, entry: SortEntry): number {
  let cmp: number
  if (entry.key === 'age') {
    cmp = a.age - b.age
  } else {
    cmp = a[entry.key].localeCompare(b[entry.key])
  }
  return entry.dir === 'asc' ? cmp : -cmp
}

export function sortRows(rows: Person[], sorts: SortEntry[]): Person[] {
  if (sorts.length === 0) return [...rows]
  const indexed = rows.map((row, i) => ({ row, i }))
  indexed.sort((x, y) => {
    for (const entry of sorts) {
      const cmp = compareBy(x.row, y.row, entry)
      if (cmp !== 0) return cmp
    }
    return x.i - y.i // stable
  })
  return indexed.map((e) => e.row)
}
