'use client'
import type { Supplier } from '../lib/types'

export default function SupplierCard({
  supplier,
  onOpen,
}: {
  supplier: Supplier
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`supplier-${supplier.id}`}>
      <span data-testid={`supplier-${supplier.id}-name`}>{supplier.name}</span>
      <span data-testid={`supplier-${supplier.id}-category`}>{supplier.category}</span>
      <span data-testid={`supplier-${supplier.id}-lead`}>{supplier.leadTimeDays}</span>
      <span data-testid={`supplier-${supplier.id}-rating`}>{supplier.rating}</span>
      <button data-testid={`open-${supplier.id}`} onClick={() => onOpen(supplier.id)}>
        View
      </button>
    </li>
  )
}
