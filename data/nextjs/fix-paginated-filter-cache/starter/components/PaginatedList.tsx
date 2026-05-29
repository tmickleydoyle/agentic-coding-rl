'use client'
import { useRef, useState } from 'react'

const PAGE_SIZE = 3

interface PaginatedListProps {
  items: string[]
}

export default function PaginatedList({ items }: PaginatedListProps) {
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  // BUG: cache keyed by page number only. After the filter changes, a page that was
  // already cached under the previous filter is served from here, showing stale rows.
  const cache = useRef<Map<number, string[]>>(new Map())

  const filtered = items.filter((it) => it.includes(filter))
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)

  let rows = cache.current.get(current)
  if (!rows) {
    const start = (current - 1) * PAGE_SIZE
    rows = filtered.slice(start, start + PAGE_SIZE)
    cache.current.set(current, rows)
  }

  const onFilter = (value: string) => {
    // BUG: does not reset to page 1 or invalidate the cache on filter change.
    setFilter(value)
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
