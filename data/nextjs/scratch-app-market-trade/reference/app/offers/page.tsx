'use client'
import { useApp } from '../../components/AppStateProvider'
import { filterByStatus } from '../../hooks/useTrades'
import type { StatusFilter } from '../../lib/types'

export default function OffersPage() {
  const { offers, items, statusFilter, setStatusFilter } = useApp()
  const matching = filterByStatus(offers, statusFilter)

  const itemName = (id: string): string => items.find((i) => i.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-offers">
      <h1>All offers</h1>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="declined">Declined</option>
      </select>
      {matching.length === 0 ? (
        <p data-testid="no-matching">No offers match this filter.</p>
      ) : (
        <ul data-testid="all-offers-list">
          {matching.map((o) => (
            <li key={o.id} data-testid={`alloffer-${o.id}`} data-status={o.status}>
              <span data-testid={`alloffer-${o.id}-item`}>{itemName(o.itemId)}</span>
              <span data-testid={`alloffer-${o.id}-give`}>{o.give}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
