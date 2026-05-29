'use client'
import { useState } from 'react'

export default function SortableList({ items }: { items: string[] }) {
  // TODO: cycle through original -> asc -> desc -> original on click.
  // Update button label (next action) and order indicator.
  return (
    <div>
      <button data-testid="sort">Sort A→Z</button>
      <span data-testid="order">original</span>
      <ul data-testid="list">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  )
}
