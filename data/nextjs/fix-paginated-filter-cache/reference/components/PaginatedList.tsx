'use client'
import { useRef, useState } from 'react'

const PAGE_SIZE = 3

interface PaginatedListProps {
  items: string[]
}

export default function PaginatedList({ items }: PaginatedListProps) {
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const cache = useRef<Map<string, string[]>>(new Map())

  const filtered = items.filter((it) => it.includes(filter))
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)

  // Cache key includes the active filter, so changing the filter never serves rows
  // computed under a different filter.
  const key = `${filter}::${current}`
  let rows = cache.current.get(key)
  if (!rows) {
    const start = (current - 1) * PAGE_SIZE
    rows = filtered.slice(start, start + PAGE_SIZE)
    cache.current.set(key, rows)
  }

  const onFilter = (value: string) => {
    setFilter(value)
    setPage(1) // changing the filter resets to the first page
  }

  return (
    <div>
      <input
        data-testid="filter"
        value={filter}
        onChange={(e) => onFilter(e.target.value)}
      />
      <button
        data-testid="prev"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={current <= 1}
      >
        Prev
      </button>
      <span data-testid="page">{current}</span>
      <button
        data-testid="next"
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        disabled={current >= pageCount}
      >
        Next
      </button>
      <ul>
        {rows.map((r, i) => (
          <li key={i} data-testid={`row-${i}`}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}
