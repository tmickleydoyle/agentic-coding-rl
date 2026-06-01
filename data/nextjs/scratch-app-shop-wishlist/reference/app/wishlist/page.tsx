'use client'
import { useShop } from '../../components/AppStateProvider'
import { useWishlist } from '../../hooks/useWishlist'

export default function WishlistPage() {
  const { moveToCart, removeFromWishlist } = useShop()
  const { wishlistProducts } = useWishlist()

  if (wishlistProducts.length === 0) {
    return (
      <section data-testid="page-wishlist">
        <h1>Wishlist</h1>
        <p data-testid="wishlist-empty">Your wishlist is empty.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-wishlist">
      <h1>Wishlist</h1>
      <ul data-testid="wishlist-items">
        {wishlistProducts.map((p) => (
          <li key={p.id} data-testid={`wish-item-${p.id}`}>
            <span data-testid={`wish-item-${p.id}-name`}>{p.name}</span>
            <button data-testid={`move-${p.id}`} onClick={() => moveToCart(p.id)}>
              Move to cart
            </button>
            <button data-testid={`wish-remove-${p.id}`} onClick={() => removeFromWishlist(p.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
