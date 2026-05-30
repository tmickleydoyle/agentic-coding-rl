import type { Priority, Ticket } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tickets` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTickets(_filter?: { breached?: string | null }): Ticket[] {
  // TODO: return tickets, applying the optional ?breached=true filter (use isBreached)
  return []
}

export function createTicket(_input: {
  subject: string
  priority?: Priority
  slaMinutes?: number
  elapsedMinutes?: number
}): Ticket {
  // TODO: append a new unresponded ticket with a fresh id and return it
  return { id: '', subject: '', priority: 'normal', slaMinutes: 0, elapsedMinutes: 0, responded: false, escalated: false }
}

export function findTicket(_id: string): Ticket | undefined {
  // TODO: look up a ticket by id
  return undefined
}

export function respondTicket(_id: string): Ticket | undefined {
  // TODO: mark the ticket responded; return it or undefined if absent
  return undefined
}

export function escalateTicket(_id: string): Ticket | undefined {
  // TODO: set escalated and bump priority; return it or undefined if absent
  return undefined
}

export function deleteTicket(_id: string): boolean {
  // TODO: remove the ticket; return whether it existed
  return false
}
