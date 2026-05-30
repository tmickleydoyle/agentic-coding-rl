'use client'
import { useShop } from '../../components/AppStateProvider'

export default function ProductPage() {
  const { products, selectedId, addToCart } = useShop()
  const product = products.find((p) => p.id === selectedId)

  if (!product) {
    return (
      <section data-testid="page-product">
        <h1>Product</h1>
        <p data-testid="no-selection">No product selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-product">
      <h1>Product</h1>
      <span data-testid="product-name">{product.name}</span>
      <span data-testid="product-category">{product.category}</span>
      <span data-testid="product-price">{product.price}</span>
      <button data-testid="add-to-cart" onClick={() => addToCart(product.id)}>
        Add to cart
      </button>
    </section>
  )
}
