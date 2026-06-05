'use client'
import { useMenu } from '../../components/AppStateProvider'
import { useMenuViews } from '../../hooks/useMenuViews'

export default function CartPage() {
  const { dishes, cart, setQty, removeFromCart, clearCart } = useMenu()
  const { subtotal, tax, total } = useMenuViews()

  const dishName = (id: string): string =>
    dishes.find((d) => d.id === id)?.name ?? 'Unknown'
  const lineQty = (dishId: string): number =>
    cart.find((l) => l.dishId === dishId)?.qty ?? 0

  return (
    <section data-testid="page-cart">
      <h1>Cart</h1>
      <button data-testid="clear-cart" onClick={clearCart}>
        Clear cart
      </button>
      {cart.length === 0 ? (
        <p data-testid="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <ul data-testid="cart-lines">
            {cart.map((line) => (
              <li key={line.dishId} data-testid={`line-${line.dishId}`}>
                <span data-testid={`line-${line.dishId}-name`}>{dishName(line.dishId)}</span>
                <span data-testid={`line-${line.dishId}-qty`}>{line.qty}</span>
                <button
                  data-testid={`inc-${line.dishId}`}
                  onClick={() => setQty(line.dishId, lineQty(line.dishId) + 1)}
                >
                  +
                </button>
                <button
                  data-testid={`dec-${line.dishId}`}
                  onClick={() => setQty(line.dishId, lineQty(line.dishId) - 1)}
                >
                  -
                </button>
                <button
                  data-testid={`remove-${line.dishId}`}
                  onClick={() => removeFromCart(line.dishId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p data-testid="cart-subtotal">{subtotal}</p>
          <p data-testid="cart-tax">{tax}</p>
          <p data-testid="cart-total">{total}</p>
        </>
      )}
    </section>
  )
}
