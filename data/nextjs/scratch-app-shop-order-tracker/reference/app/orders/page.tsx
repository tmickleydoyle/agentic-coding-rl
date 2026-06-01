'use client'
import { useShop } from '../../components/AppStateProvider'
import { useOrders } from '../../hooks/useOrders'
import OrderRow from '../../components/OrderRow'
import type { StatusFilter } from '../../lib/types'

export default function OrdersPage() {
  const { statusFilter, setStatusFilter, selectOrder } = useShop()
  const { filtered } = useOrders()

  return (
    <section data-testid="page-orders">
      <h1>Orders</h1>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
      >
        <option value="all">All</option>
        <option value="placed">Placed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
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
