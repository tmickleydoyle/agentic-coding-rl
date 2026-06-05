'use client'
import { useOrdersState } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'
import OrderRow from '../../components/OrderRow'
import type { StatusFilter } from '../../lib/types'

export default function OrdersPage() {
  const { statusFilter, setStatusFilter, selectOrder } = useOrdersState()
  const { filtered } = useOrders()

  return (
    <section data-testid="page-orders">
      <h1>Purchase orders</h1>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="partial">Partial</option>
        <option value="received">Received</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No orders match this filter.</p>
      ) : (
        <ul data-testid="order-list">
          {filtered.map((o) => (
            <OrderRow key={o.id} order={o} onView={selectOrder} />
          ))}
        </ul>
      )}
    </section>
  )
}
