'use client'
import type { Ticket } from '../lib/types'

export default function TicketRow({
  ticket,
  onOpen,
}: {
  ticket: Ticket
  onOpen: (id: string) => void
}) {
  // TODO: render the ticket row with subject/status/priority/assignee and an open-<id> button
  void onOpen
  return <li data-testid={`ticket-${ticket.id}`} />
}
