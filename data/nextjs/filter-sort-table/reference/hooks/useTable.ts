import { useMemo, useState } from 'react'
import type { Person, SortDir, SortKey } from '../components/types'
import { PAGE_SIZE } from '../components/types'

export function useTable(rows: Person[]) {
  const [filter, setFilterState] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)

  const setFilter = (value: string) => {
    setFilterState(value)
    setPage(0)
  }

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const f = q ? rows.filter((r) => r.name.toLowerCase().includes(q)) : rows
    const sorted = [...f].sort((a, b) => {
      const cmp =
        sortKey === 'name' ? a.name.localeCompare(b.name) : a.age - b.age
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [rows, filter, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return {
    filter,
    setFilter,
    sortKey,
    sortDir,
    toggleSort,
    page,
    setPage,
    pageRows,
    pageCount,
  }
}
