'use client'
import { useShop } from '../../components/AppStateProvider'
import { useWishlist } from '../../hooks/useWishlist'
import Filters from '../../components/Filters'
import ProductCard from '../../components/ProductCard'

export default function BrowsePage() {
  const {
    products,
    wishlist,
    categoryFilter,
    maxPrice,
    setCategoryFilter,
    setMaxPrice,
    toggleWishlist,
    addToCart,
  } = useShop()
  const { visible } = useWishlist()

  return (
    <section data-testid="page-browse">
      <h1>Browse</h1>
      <Filters
        products={products}
        categoryFilter={categoryFilter}
        maxPrice={maxPrice}
        onCategoryChange={setCategoryFilter}
        onMaxPriceChange={setMaxPrice}
      />
      {visible.length === 0 ? (
        <p data-testid="empty-state">No products match these filters.</p>
      ) : (
        <ul data-testid="product-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={wishlist.indexOf(p.id) !== -1}
              onToggleWish={toggleWishlist}
              onAdd={addToCart}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
