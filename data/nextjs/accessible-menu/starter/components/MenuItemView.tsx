'use client'
import type { MenuItem } from './types'

// TODO: render <li data-testid="item-<id>"> with aria-selected="true" when highlighted (else
// no aria-selected), containing a <button>{label}</button> whose click calls onActivate(id).
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
    <li data-testid={`item-${item.id}`}>
      <button>{item.label}</button>
    </li>
  )
}
