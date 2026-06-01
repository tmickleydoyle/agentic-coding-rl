'use client'
import { useApp } from '../../components/AppStateProvider'
import { productsBySupplier } from '../../hooks/useSuppliers'

export default function SupplierDetailPage() {
  const { suppliers, products, selectedId } = useApp()
  const supplier = suppliers.find((s) => s.id === selectedId) ?? null
  if (!supplier) {
    return (
      <section data-testid="page-supplier-detail">
        <p data-testid="no-selection">No supplier selected.</p>
      </section>
    )
  }
  const supplied = productsBySupplier(products, supplier.id)
  return (
    <section data-testid="page-supplier-detail">
      <h1 data-testid="detail-name">{supplier.name}</h1>
      <p data-testid="detail-category">{supplier.category}</p>
      <p data-testid="detail-lead">{supplier.leadTimeDays}</p>
      <p data-testid="detail-rating">{supplier.rating}</p>
      <p data-testid="detail-product-count">{supplied.length}</p>
      {supplied.length === 0 ? (
        <p data-testid="detail-empty">No products supplied.</p>
      ) : (
        <ul data-testid="detail-products">
          {supplied.map((p) => (
            <li key={p.id} data-testid={`detail-product-${p.id}`}>
              <span data-testid={`detail-product-${p.id}-name`}>{p.name}</span>
              <span data-testid={`detail-product-${p.id}-price`}>{p.price}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
