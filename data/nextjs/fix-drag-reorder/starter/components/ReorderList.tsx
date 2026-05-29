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
      // BUG: when moving downward, this "adjusts" the insert index by subtracting
      // one — but `to` is already in final coordinates, so the item lands a slot early.
      const insertAt = to > from ? to - 1 : to
      next.splice(insertAt, 0, moved)
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
