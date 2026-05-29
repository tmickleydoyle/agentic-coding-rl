'use client'
import { useState } from 'react'
import type { Item } from './types'
import Toolbar from './Toolbar'

export default function BulkList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(items.map((i) => i.id)))
  const clear = () => setSelected(new Set())
  const deleteSelected = () => {
    setItems((prev) => prev.filter((i) => !selected.has(i.id)))
    setSelected(new Set())
  }

  return (
    <div>
      <Toolbar
        selectedCount={selected.size}
        onSelectAll={selectAll}
        onClear={clear}
        onDelete={deleteSelected}
      />
      <ul data-testid="list">
        {items.map((item) => (
          <li key={item.id} data-testid={`row-${item.id}`}>
            <label>
              {item.label}
              <input
                type="checkbox"
                data-testid={`check-${item.id}`}
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
