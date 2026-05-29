import type { Product } from './types'
import ProductCard from './ProductCard'

export default function ProductList({ products }: { products: Product[] }) {
  const inStockCount = products.filter((p) => p.inStock).length
  return (
    <section data-testid="list">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
      <span data-testid="count">{inStockCount}</span>
    </section>
  )
}
