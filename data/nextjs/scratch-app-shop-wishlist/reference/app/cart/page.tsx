'use client'
import { useShop } from '../../components/AppStateProvider'

export default function CartPage() {
  const { products, cart, removeFromCart } = useShop()

  if (cart.length === 0) {
    return (
      <section data-testid="page-cart">
        <h1>Cart</h1>
        <p data-testid="cart-empty">Your cart is empty.</p>
      </section>
    )
  }

  const nameOf = (id: string): string => products.find((p) => p.id === id)?.name ?? 'Unknown'
  const priceOf = (id: string): number => products.find((p) => p.id === id)?.price ?? 0
  const total = cart.reduce((sum, l) => sum + priceOf(l.productId) * l.qty, 0)

  return (
    <section data-testid="page-cart">
      <h1>Cart</h1>
      <ul data-testid="cart-lines">
        {cart.map((l) => (
          <li key={l.productId} data-testid={`cart-line-${l.productId}`}>
            <span data-testid={`cart-line-${l.productId}-name`}>{nameOf(l.productId)}</span>
            <span data-testid={`cart-qty-${l.productId}`}>{l.qty}</span>
            <button data-testid={`cart-remove-${l.productId}`} onClick={() => removeFromCart(l.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <span data-testid="cart-total">{total}</span>
    </section>
  )
}
