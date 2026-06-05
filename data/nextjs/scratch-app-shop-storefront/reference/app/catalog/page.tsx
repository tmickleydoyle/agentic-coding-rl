'use client'
import { useShop } from '../../components/AppStateProvider'
import { useCart } from '../../hooks/useCart'
import Filters from '../../components/Filters'
import ProductCard from '../../components/ProductCard'

export default function CatalogPage() {
  const {
    products,
    categoryFilter,
    maxPrice,
    setCategoryFilter,
    setMaxPrice,
    selectProduct,
    addToCart,
  } = useShop()
  const { visible } = useCart()

  return (
    <section data-testid="page-catalog">
      <h1>Catalog</h1>
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
            <ProductCard key={p.id} product={p} onView={selectProduct} onAdd={addToCart} />
          ))}
        </ul>
      )}
    </section>
  )
}
