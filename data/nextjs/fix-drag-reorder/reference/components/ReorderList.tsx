'use client'
import { useState } from 'react'

interface ReorderListProps {
  initialItems: string[]
}

export default function ReorderList({ initialItems }: ReorderListProps) {
  const [items, setItems] = useState<string[]>(initialItems)

  const reorder = (from: number, to: number) => {
    if (from === to) return
    if (from < 0 || from >= items.length) return
    if (to < 0 || to >= items.length) return
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      // After removing `from`, indices past it shifted left by one, but the target
      // `to` is expressed in the FINAL array's coordinates, so insert at `to`.
      next.splice(to, 0, moved)
      return next
    })
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li key={item}>
          <span data-testid={`item-${i}`}>{item}</span>
          <button
            data-testid={`up-${i}`}
            onClick={() => reorder(i, i - 1)}
            disabled={i === 0}
          >
            Up
          </button>
          <button
            data-testid={`down-${i}`}
            onClick={() => reorder(i, i + 1)}
            disabled={i === items.length - 1}
          >
            Down
          </button>
        </li>
      ))}
    </ul>
  )
}
