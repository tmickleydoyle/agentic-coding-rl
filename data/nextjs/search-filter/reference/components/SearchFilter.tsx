'use client'
import { useState } from 'react'

export default function SearchFilter({ items }: { items: string[] }) {
  const [q, setQ] = useState('')
  const lower = q.toLowerCase()
  const filtered = items.filter((it) => it.toLowerCase().includes(lower))
  return (
    <div>
      <input data-testid="query" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul data-testid="results">
        {filtered.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
      {filtered.length === 0 && <p data-testid="no-results">No matches</p>}
    </div>
  )
}
