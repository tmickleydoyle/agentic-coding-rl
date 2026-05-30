'use client'
import { useShop } from '../../components/AppStateProvider'
import { useCart } from '../../hooks/useCart'

export default function CartPage() {
  const { setQty, removeFromCart, navigate } = useShop()
  const { lines, subtotal, tax, total } = useCart()

  if (lines.length === 0) {
    return (
      <section data-testid="page-cart">
        <h1>Cart</h1>
        <p data-testid="cart-empty">Your cart is empty.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-cart">
      <h1>Cart</h1>
      <ul data-testid="cart-lines">
        {lines.map((l) => (
          <li key={l.productId} data-testid={`cart-line-${l.productId}`}>
            <span data-testid={`cart-line-${l.productId}-name`}>{l.name}</span>
            <span data-testid={`line-subtotal-${l.productId}`}>{l.subtotal}</span>
            <input
              type="number"
              data-testid={`qty-input-${l.productId}`}
              value={l.qty}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === '') return
                setQty(l.productId, Number(raw))
              }}
            />
            <button data-testid={`remove-${l.productId}`} onClick={() => removeFromCart(l.productId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <span data-testid="cart-subtotal">{subtotal}</span>
      <span data-testid="cart-tax">{tax}</span>
      <span data-testid="cart-total">{total}</span>
      <button data-testid="go-checkout" onClick={() => navigate('checkout')}>
        Checkout
      </button>
    </section>
  )
}
