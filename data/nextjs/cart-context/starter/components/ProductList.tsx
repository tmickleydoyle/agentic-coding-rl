'use client'
import type { Product } from './types'
import { useCart } from './CartContext'

// TODO: render one <button data-testid="add-<id>">Add {name}</button> per product; clicking it
// calls add(product) from useCart().
export default function ProductList({ products }: { products: Product[] }) {
  const { add } = useCart()
  return <div />
}
