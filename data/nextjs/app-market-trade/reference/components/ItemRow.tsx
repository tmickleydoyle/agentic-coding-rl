'use client'
import type { Item } from '../lib/types'

export default function ItemRow({
  item,
  onView,
}: {
  item: Item
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`item-${item.id}`}>
      <span data-testid={`item-${item.id}-name`}>{item.name}</span>
      <span data-testid={`item-${item.id}-owner`}>{item.owner}</span>
      <button data-testid={`view-${item.id}`} onClick={() => onView(item.id)}>
        View
      </button>
    </li>
  )
}
