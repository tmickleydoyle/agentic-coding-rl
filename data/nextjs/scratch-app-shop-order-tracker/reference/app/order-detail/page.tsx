'use client'
import { useShop } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'

export default function OrderDetailPage() {
  const { reorder, navigate } = useShop()
  const { selected } = useOrders()

  if (!selected) {
    return (
      <section data-testid="page-order-detail">
        <h1>Order detail</h1>
        <p data-testid="no-selection">No order selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-order-detail">
      <h1>Order detail</h1>
      <span data-testid="detail-item">{selected.item}</span>
      <span data-testid="detail-total">{selected.total}</span>
      <span data-testid="detail-status">{selected.status}</span>
      <button data-testid="reorder" onClick={() => reorder(selected.id)}>
        Reorder
      </button>
      <button data-testid="go-track" onClick={() => navigate('track')}>
        Track
      </button>
    </section>
  )
}
