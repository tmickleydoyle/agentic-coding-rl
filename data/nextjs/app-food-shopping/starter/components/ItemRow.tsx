'use client'
import type { Item } from '../lib/types'

export default function ItemRow(_props: {
  item: Item
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  // TODO: render the item row (name, qty, toggle + remove buttons, data-bought).
  return <li data-testid={`item-${_props.item.id}`} />
}
