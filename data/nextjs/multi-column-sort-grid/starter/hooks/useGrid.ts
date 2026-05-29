import { useState } from 'react'
import type { Person, SortEntry, SortKey } from '../components/types'

// TODO: return { sorts, toggleSort, sortedRows, selected, toggleRow, toggleAll, allSelected,
// someSelected }. toggleSort applies cycleSort. sortedRows = sortRows(rows, sorts). toggleRow
// adds/removes one id. toggleAll selects all unless all already selected (then clears).
// allSelected = every row selected and rows.length>0. someSelected = some but not all.
export function useGrid(rows: Person[]) {
  const [sorts, setSorts] = useState<SortEntry[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  return {
    sorts,
    toggleSort: (_key: SortKey) => {},
    sortedRows: rows,
    selected,
    toggleRow: (_id: number) => {},
    toggleAll: () => {},
    allSelected: false,
    someSelected: false,
  }
}
