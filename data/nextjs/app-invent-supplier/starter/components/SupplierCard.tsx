'use client'
import type { Supplier } from '../lib/types'

export default function SupplierCard(_props: { supplier: Supplier; onOpen: (id: string) => void }) {
  // TODO: render supplier-<id> with -name/-category/-lead/-rating and an open-<id> button
  return <li data-testid={`supplier-${_props.supplier.id}`} />
}
