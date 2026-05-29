'use client'
import { useCart } from '../hooks/useCart'
import type { Item } from './types'
import { CartContext } from './CartContext'
import ItemList from './ItemList'
import CartLine from './CartLine'

// TODO: instantiate useCart(); provide via CartContext.Provider; render ItemList,
// then <ul data-testid="cart-lines"> of CartLines, then <span data-testid="cart-total">.
export default function Cart({ items }: { items: Item[] }) {
  const api = useCart()
  return <CartContext.Provider value={api} />
}
