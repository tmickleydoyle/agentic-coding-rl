'use client'
import { useApp } from '../../components/AppStateProvider'
import { isBreached, remainingMinutes } from '../../lib/types'

export default function TicketDetailPage() {
  const { tickets, selectedTicketId, respond, escalate } = useApp()
  const ticket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId)
    : undefined

  if (!ticket) {
    return (
      <section data-testid="page-ticket-detail">
        <p data-testid="no-selection">No ticket selected.</p>
      </section>
    )
  }

  const breached = isBreached(ticket)

  return (
    <section data-testid="page-ticket-detail" data-breached={breached ? 'true' : 'false'}>
      <h1 data-testid="detail-subject">{ticket.subject}</h1>
      <p data-testid="detail-priority">{ticket.priority}</p>
      <p data-testid="detail-sla">{ticket.slaMinutes}</p>
      <p data-testid="detail-elapsed">{ticket.elapsedMinutes}</p>
      <p data-testid="detail-remaining">{remainingMinutes(ticket)}</p>
      <p data-testid="detail-status">{breached ? 'BREACHED' : 'OK'}</p>
      <p data-testid="detail-responded">{ticket.responded ? 'responded' : 'awaiting'}</p>
      <p data-testid="detail-escalated">{ticket.escalated ? 'escalated' : 'normal'}</p>
      <button data-testid="respond-btn" onClick={() => respond(ticket.id)}>
        Respond
      </button>
      <button data-testid="escalate-btn" onClick={() => escalate(ticket.id)}>
        Escalate
      </button>
    </section>
  )
}
