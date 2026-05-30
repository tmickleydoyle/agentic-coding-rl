import type { Priority, Ticket, TicketStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tickets` and id counters; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTickets(_filter?: {
  status?: string | null
  priority?: string | null
  assignee?: string | null
}): Ticket[] {
  // TODO: return tickets, applying optional status/priority/assignee filters
  return []
}

export function createTicket(_input: {
  subject: string
  requester?: string
  priority?: Priority
}): Ticket {
  // TODO: append a new open ticket with a fresh id and return it
  return { id: '', subject: '', requester: '', priority: 'normal', status: 'open', assignee: null, replies: [] }
}

export function findTicket(_id: string): Ticket | undefined {
  // TODO: look up a ticket by id
  return undefined
}

export function updateTicket(
  _id: string,
  _patch: { assignee?: string | null; status?: TicketStatus; priority?: Priority },
): Ticket | undefined {
  // TODO: apply the patch and return the updated ticket, or undefined if absent
  return undefined
}

export function addReply(
  _id: string,
  _input: { author: string; body: string },
): Ticket | undefined {
  // TODO: append a reply and return the updated ticket, or undefined if absent
  return undefined
}

export function deleteTicket(_id: string): boolean {
  // TODO: remove the ticket; return whether it existed
  return false
}
