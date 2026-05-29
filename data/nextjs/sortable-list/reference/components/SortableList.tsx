'use client'
import { useState } from 'react'

type Order = 'original' | 'asc' | 'desc'

const NEXT_LABEL: Record<Order, string> = {
  original: 'Sort A→Z',
  asc: 'Sort Z→A',
  desc: 'Original order',
}

const NEXT_STATE: Record<Order, Order> = {
  original: 'asc',
  asc: 'desc',
  desc: 'original',
}

export default function SortableList({ items }: { items: string[] }) {
  const [order, setOrder] = useState<Order>('original')

  const shown = (() => {
    if (order === 'asc') return [...items].sort()
    if (order === 'desc') return [...items].sort().reverse()
    return items
  })()

  return (
    <div>
      <button data-testid="sort" onClick={() => setOrder(NEXT_STATE[order])}>
        {NEXT_LABEL[order]}
      </button>
      <span data-testid="order">{order}</span>
      <ul data-testid="list">
        {shown.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  )
}
