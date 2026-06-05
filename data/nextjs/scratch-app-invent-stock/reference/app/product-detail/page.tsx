'use client'
import { useStock } from '../../components/AppStateProvider'
import { useProducts } from '../../hooks/useProducts'
import { isLow } from '../../lib/types'

export default function ProductDetailPage() {
  const { navigate } = useStock()
  const { selected } = useProducts()

  if (!selected) {
    return (
      <section data-testid="page-product-detail">
        <h1>Product detail</h1>
        <p data-testid="no-selection">No product selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-product-detail">
      <h1>Product detail</h1>
      <span data-testid="detail-name">{selected.name}</span>
      <span data-testid="detail-qty">{selected.qty}</span>
      <span data-testid="detail-reorder">{selected.reorderPoint}</span>
      <span data-testid="detail-status">{isLow(selected) ? 'low' : 'ok'}</span>
      <button data-testid="go-adjust" onClick={() => navigate('adjust')}>
        Adjust
      </button>
    </section>
  )
}
