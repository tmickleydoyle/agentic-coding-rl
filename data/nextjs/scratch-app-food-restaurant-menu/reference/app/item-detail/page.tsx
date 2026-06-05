'use client'
import { useMenu } from '../../components/AppStateProvider'

export default function ItemDetailPage() {
  const { dishes, selectedId, addToCart } = useMenu()
  const dish = dishes.find((d) => d.id === selectedId)

  return (
    <section data-testid="page-item-detail">
      <h1>Item</h1>
      {!dish ? (
        <p data-testid="no-selection">No dish selected.</p>
      ) : (
        <div data-testid="item-detail">
          <h2 data-testid="detail-name">{dish.name}</h2>
          <p data-testid="detail-category">{dish.category}</p>
          <p data-testid="detail-price">{dish.price}</p>
          <button data-testid="detail-add" onClick={() => addToCart(dish.id)}>
            Add to cart
          </button>
        </div>
      )}
    </section>
  )
}
