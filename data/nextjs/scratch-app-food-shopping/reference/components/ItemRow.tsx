'use client'
import type { Item } from '../lib/types'

export default function ItemRow({
  item,
  onToggle,
  onRemove,
}: {
  item: Item
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`item-${item.id}`} data-bought={item.bought ? 'true' : 'false'}>
      <span data-testid={`item-${item.id}-name`}>{item.name}</span>
      <span data-testid={`item-${item.id}-qty`}>{item.qty}</span>
      <button data-testid={`toggle-${item.id}`} onClick={() => onToggle(item.id)}>
        {item.bought ? 'Unbuy' : 'Buy'}
      </button>
      <button data-testid={`remove-${item.id}`} onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </li>
  )
}
