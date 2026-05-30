'use client'
import type { Ticket } from '../lib/types'
import { isBreached, remainingMinutes } from '../lib/types'

export default function TicketRow({
  ticket,
  onOpen,
}: {
  ticket: Ticket
  onOpen: (id: string) => void
}) {
  const breached = isBreached(ticket)
  return (
    <li
      data-testid={`ticket-${ticket.id}`}
      data-priority={ticket.priority}
      data-breached={breached ? 'true' : 'false'}
    >
      <span data-testid={`ticket-${ticket.id}-subject`}>{ticket.subject}</span>
      <span data-testid={`ticket-${ticket.id}-priority`}>{ticket.priority}</span>
      <span data-testid={`ticket-${ticket.id}-remaining`}>{remainingMinutes(ticket)}</span>
      <span data-testid={`ticket-${ticket.id}-breached`}>{breached ? 'BREACHED' : 'OK'}</span>
      <button data-testid={`open-${ticket.id}`} onClick={() => onOpen(ticket.id)}>
        Open
      </button>
    </li>
  )
}
