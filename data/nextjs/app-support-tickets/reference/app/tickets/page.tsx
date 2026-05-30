'use client'
import { useApp } from '../../components/AppStateProvider'
import TicketRow from '../../components/TicketRow'

export default function TicketsPage() {
  const { tickets, selectTicket } = useApp()
  return (
    <section data-testid="page-tickets">
      <h1>Tickets</h1>
      {tickets.length === 0 ? (
        <p data-testid="empty-state">No tickets.</p>
      ) : (
        <ul data-testid="ticket-list">
          {tickets.map((t) => (
            <TicketRow key={t.id} ticket={t} onOpen={selectTicket} />
          ))}
        </ul>
      )}
    </section>
  )
}
