import type { Product } from './types'
import ProductCard from './ProductCard'

// TODO: render <section data-testid="list"> with one ProductCard per product,
// and <span data-testid="count"> with the in-stock count.
export default function ProductList({ products }: { products: Product[] }) {
  return <section data-testid="list"></section>
}
