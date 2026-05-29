import { useMemo, useState } from 'react'
import type { Person, SortEntry, SortKey } from '../components/types'
import { cycleSort, sortRows } from '../lib/sort'

export function useGrid(rows: Person[]) {
  const [sorts, setSorts] = useState<SortEntry[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggleSort = (key: SortKey) => {
    setSorts((prev) => cycleSort(prev, key))
  }

  const sortedRows = useMemo(() => sortRows(rows, sorts), [rows, sorts])

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const someSelected = selected.size > 0 && !allSelected

  const toggleAll = () => {
    setSelected(() => {
      if (allSelected) return new Set()
      return new Set(rows.map((r) => r.id))
    })
  }

  return {
    sorts,
    toggleSort,
    sortedRows,
    selected,
    toggleRow,
    toggleAll,
    allSelected,
    someSelected,
  }
}
