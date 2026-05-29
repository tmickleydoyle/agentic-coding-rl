'use client'
import type { Product } from './types'
import { CartProvider } from './CartContext'
import ProductList from './ProductList'
import CartSummary from './CartSummary'

export default function App({ products }: { products: Product[] }) {
  return (
    <CartProvider>
      <ProductList products={products} />
      <CartSummary />
    </CartProvider>
  )
}
