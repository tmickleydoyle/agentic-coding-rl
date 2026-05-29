'use client'
import type { Product } from './types'
import { useCart } from './CartContext'

export default function ProductList({ products }: { products: Product[] }) {
  const { add } = useCart()
  return (
    <div>
      {products.map((p) => (
        <button key={p.id} data-testid={`add-${p.id}`} onClick={() => add(p)}>
          Add {p.name}
        </button>
      ))}
    </div>
  )
}
