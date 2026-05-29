'use client'
import type { Product } from './types'
import { CartProvider } from './CartContext'
import ProductList from './ProductList'
import CartSummary from './CartSummary'

// TODO: wrap <ProductList products={products} /> and <CartSummary /> in one <CartProvider> so
// both share a single cart.
export default function App({ products }: { products: Product[] }) {
  return (
    <CartProvider>
      <ProductList products={products} />
      <CartSummary />
    </CartProvider>
  )
}
