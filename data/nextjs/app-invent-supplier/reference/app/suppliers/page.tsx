'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSuppliers } from '../../hooks/useSuppliers'
import SupplierCard from '../../components/SupplierCard'

export default function SuppliersPage() {
  const { categoryFilter, setCategoryFilter, selectSupplier } = useApp()
  const { filtered, cats, avgLeadTime } = useSuppliers()
  return (
    <section data-testid="page-suppliers">
      <h1>Suppliers</h1>
      <select
        data-testid="category-filter"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All categories</option>
        {cats.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <p data-testid="avg-lead-time">{avgLeadTime}</p>
      <p data-testid="supplier-count">{filtered.length}</p>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No suppliers match.</p>
      ) : (
        <ul data-testid="supplier-list">
          {filtered.map((s) => (
            <SupplierCard key={s.id} supplier={s} onOpen={selectSupplier} />
          ))}
        </ul>
      )}
    </section>
  )
}
