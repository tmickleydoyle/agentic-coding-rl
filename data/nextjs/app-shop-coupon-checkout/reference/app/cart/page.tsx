'use client'
import { useShop } from '../../components/AppStateProvider'
import { useCheckout } from '../../hooks/useCheckout'
import CartLineRow from '../../components/CartLineRow'

export default function CartPage() {
  const { products, addToCart, setQty, removeFromCart } = useShop()
  const { lines, subtotal } = useCheckout()

  return (
    <section data-testid="page-cart">
      <h1>Cart</h1>
      <ul data-testid="product-list">
        {products.map((p) => (
          <li key={p.id} data-testid={`product-${p.id}`}>
            <span data-testid={`product-${p.id}-name`}>{p.name}</span>
            <span data-testid={`price-${p.id}`}>{p.price}</span>
            <button data-testid={`add-${p.id}`} onClick={() => addToCart(p.id)}>
              Add
            </button>
          </li>
        ))}
      </ul>
      {lines.length === 0 ? (
        <p data-testid="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <ul data-testid="cart-lines">
            {lines.map((l) => (
              <CartLineRow key={l.productId} line={l} onQty={setQty} onRemove={removeFromCart} />
            ))}
          </ul>
          <span data-testid="cart-subtotal">{subtotal}</span>
        </>
      )}
    </section>
  )
}
