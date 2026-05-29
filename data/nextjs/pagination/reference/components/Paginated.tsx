'use client'
import { useState } from 'react'

const PAGE_SIZE = 5

export default function Paginated({ items }: { items: string[] }) {
  const [page, setPage] = useState(1)
  const total = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const safePage = Math.min(page, total)
  const start = (safePage - 1) * PAGE_SIZE
  const slice = items.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <ul data-testid="page">
        {slice.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
      <button
        data-testid="prev"
        disabled={safePage <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Prev
      </button>
      <button
        data-testid="next"
        disabled={safePage >= total}
        onClick={() => setPage((p) => Math.min(total, p + 1))}
      >
        Next
      </button>
      <span data-testid="indicator">
        Page {safePage} of {total}
      </span>
    </div>
  )
}
