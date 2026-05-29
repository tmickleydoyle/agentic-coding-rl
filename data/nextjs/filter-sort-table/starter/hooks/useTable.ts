import { useState } from 'react'
import type { Person, SortDir, SortKey } from '../components/types'

// TODO: return { filter, setFilter, sortKey, sortDir, toggleSort, page, setPage, pageRows, pageCount }.
// setFilter updates filter and resets page to 0. Filter = case-insensitive name substring (empty keeps
// all). toggleSort(key): flip dir if same key, else switch key with dir 'asc'. Sort filtered rows
// (localeCompare for name, numeric for age; desc reverses). pageCount = max(1, ceil(filtered/PAGE_SIZE)).
// pageRows = the PAGE_SIZE slice for the current page.
export function useTable(rows: Person[]) {
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)
  return {
    filter,
    setFilter: (_value: string) => {},
    sortKey,
    sortDir,
    toggleSort: (_key: SortKey) => {},
    page,
    setPage,
    pageRows: [] as Person[],
    pageCount: 1,
  }
}
