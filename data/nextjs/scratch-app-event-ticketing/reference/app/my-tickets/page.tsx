'use client'
import { useApp } from '../../components/AppStateProvider'
import OrderRow from '../../components/OrderRow'
import { useOrders } from '../../hooks/useOrders'

export default function MyTicketsPage() {
  const { orders, events } = useApp()
  const { ticketCount, revenue } = useOrders()

  const eventName = (id: string): string =>
    events.find((e) => e.id === id)?.name ?? 'Unknown'

  const tierName = (eventId: string, tierId: string): string => {
    const event = events.find((e) => e.id === eventId)
    return event?.tiers.find((t) => t.id === tierId)?.name ?? 'Unknown'
  }

  return (
    <section data-testid="page-my-tickets">
      <h1>My Tickets</h1>
      <span data-testid="ticket-count">{ticketCount}</span>
      <span data-testid="revenue-total">{revenue}</span>
      {orders.length === 0 ? (
        <p data-testid="empty-state">No tickets yet.</p>
      ) : (
        <ul data-testid="orders-list">
          {orders.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              eventName={eventName(o.eventId)}
              tierName={tierName(o.eventId, o.tierId)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
