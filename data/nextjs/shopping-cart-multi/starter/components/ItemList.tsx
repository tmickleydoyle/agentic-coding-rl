'use client'
import type { Item } from './types'
import { useCartContext } from './CartContext'

// TODO: render one <button data-testid={`add-${item.id}`}>Add {name}</button> per item.
// Clicking calls add(item).
export default function ItemList({ items }: { items: Item[] }) {
  const { add } = useCartContext()
  return <div />
}
