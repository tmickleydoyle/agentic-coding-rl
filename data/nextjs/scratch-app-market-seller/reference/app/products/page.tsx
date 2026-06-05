'use client'
import { useApp } from '../../components/AppStateProvider'
import ProductRow from '../../components/ProductRow'

export default function ProductsPage() {
  const { products } = useApp()
  return (
    <section data-testid="page-products">
      <h1>Products</h1>
      {products.length === 0 ? (
        <p data-testid="no-products">No products yet.</p>
      ) : (
        <ul data-testid="product-list">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
