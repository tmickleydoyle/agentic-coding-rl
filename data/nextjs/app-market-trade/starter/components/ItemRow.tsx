'use client'
import type { Item } from '../lib/types'

export default function ItemRow(_props: {
  item: Item
  onView: (id: string) => void
}) {
  // TODO: render an item row with name/owner and a view-<id> button.
  return <li data-testid={`item-${_props.item.id}`} />
}
