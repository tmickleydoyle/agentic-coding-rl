'use client'
import type { Ticket } from '../lib/types'

export default function TicketRow({
  ticket,
  onOpen,
}: {
  ticket: Ticket
  onOpen: (id: string) => void
}) {
  // TODO: render the ticket row with subject/priority/remaining/breached and an open-<id>
  // button; set data-breached on the <li> using isBreached.
  void onOpen
  return <li data-testid={`ticket-${ticket.id}`} />
}
