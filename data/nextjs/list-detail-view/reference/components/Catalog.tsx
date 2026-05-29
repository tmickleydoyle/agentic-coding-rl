'use client'
import { useState } from 'react'

type Item = { id: string; title: string; body: string }

export default function Catalog({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const current = items.find((i) => i.id === selected)

  if (current) {
    return (
      <div>
        <h1 data-testid="title">{current.title}</h1>
        <p data-testid="body">{current.body}</p>
        <button data-testid="back" onClick={() => setSelected(null)}>Back</button>
      </div>
    )
  }

  return (
    <ul data-testid="list">
      {items.map((it) => (
        <li key={it.id}>
          <button data-testid={`row-${it.id}`} onClick={() => setSelected(it.id)}>
            {it.title}
          </button>
        </li>
      ))}
    </ul>
  )
}
