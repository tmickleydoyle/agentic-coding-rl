'use client'
import type { Item } from './types'
import { useCartContext } from './CartContext'

export default function ItemList({ items }: { items: Item[] }) {
  const { add } = useCartContext()
  return (
    <div>
      {items.map((item) => (
        <button
          key={item.id}
          data-testid={`add-${item.id}`}
          onClick={() => add(item)}
        >
          Add {item.name}
        </button>
      ))}
    </div>
  )
}
