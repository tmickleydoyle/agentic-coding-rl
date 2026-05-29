'use client'
import { useCart } from '../hooks/useCart'
import type { Item } from './types'
import { CartContext } from './CartContext'
import ItemList from './ItemList'
import CartLine from './CartLine'

export default function Cart({ items }: { items: Item[] }) {
  const api = useCart()
  return (
    <CartContext.Provider value={api}>
      <ItemList items={items} />
      <ul data-testid="cart-lines">
        {api.lines.map((l) => (
          <CartLine key={l.item.id} line={l} />
        ))}
      </ul>
      <span data-testid="cart-total">{api.total}</span>
    </CartContext.Provider>
  )
}
