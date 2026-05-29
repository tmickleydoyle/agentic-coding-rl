'use client'
import type { MenuItem } from './types'

export default function MenuItemView({
  item,
  highlighted,
  onActivate,
}: {
  item: MenuItem
  index: number
  highlighted: boolean
  onActivate: (id: string) => void
}) {
  return (
    <li data-testid={`item-${item.id}`} aria-selected={highlighted ? 'true' : undefined}>
      <button onClick={() => onActivate(item.id)}>{item.label}</button>
    </li>
  )
}
