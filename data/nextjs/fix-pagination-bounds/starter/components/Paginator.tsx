'use client'
import { useState } from 'react'

const ITEMS = Array.from({ length: 12 }, (_, i) => i + 1)
const PER_PAGE = 5

export default function Paginator() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(ITEMS.length / PER_PAGE)

  const start = (page - 1) * PER_PAGE
  const visible = ITEMS.slice(start, start + PER_PAGE)

  return (
    <div>
      <ul data-testid="rows">
        {visible.map((v) => (
          <li key={v} data-testid={`row-${v}`}>
            {v}
          </li>
        ))}
      </ul>
      <span data-testid="page-info">
        Page {page} of {totalPages}
      </span>
      <button
        data-testid="prev"
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Prev
      </button>
      <button
        data-testid="next"
        disabled={page > totalPages}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  )
}
