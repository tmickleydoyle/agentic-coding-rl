'use client'
import type { Ticket } from '../lib/types'

export default function TicketRow({
  ticket,
  onOpen,
}: {
  ticket: Ticket
  onOpen: (id: string) => void
}) {
  return (
    <li
      data-testid={`ticket-${ticket.id}`}
      data-status={ticket.status}
      data-priority={ticket.priority}
    >
      <span data-testid={`ticket-${ticket.id}-subject`}>{ticket.subject}</span>
      <span data-testid={`ticket-${ticket.id}-status`}>{ticket.status}</span>
      <span data-testid={`ticket-${ticket.id}-priority`}>{ticket.priority}</span>
      <span data-testid={`ticket-${ticket.id}-assignee`}>
        {ticket.assignee ?? 'Unassigned'}
      </span>
      <button data-testid={`open-${ticket.id}`} onClick={() => onOpen(ticket.id)}>
        Open
      </button>
    </li>
  )
}
