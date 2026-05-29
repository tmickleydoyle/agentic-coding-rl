'use client'
import type { CartLine as CartLineT } from './types'
import { useCartContext } from './CartContext'

export default function CartLine({ line }: { line: CartLineT }) {
  const { remove } = useCartContext()
  return (
    <li data-testid={`line-${line.item.id}`}>
      {line.item.name} x{line.qty}
      <button
        data-testid={`remove-${line.item.id}`}
        onClick={() => remove(line.item.id)}
      >
        Remove
      </button>
    </li>
  )
}
