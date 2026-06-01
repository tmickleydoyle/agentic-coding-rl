import type { Priority, Ticket } from './types'
import { bumpPriority, isBreached } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let tickets: Ticket[] = []
let nextId = 1

function seed(): void {
  tickets = [
    { id: 'k1', subject: 'Login outage', priority: 'high', slaMinutes: 60, elapsedMinutes: 90, responded: false, escalated: false },
    { id: 'k2', subject: 'Billing inquiry', priority: 'normal', slaMinutes: 120, elapsedMinutes: 30, responded: false, escalated: false },
    { id: 'k3', subject: 'Data loss report', priority: 'urgent', slaMinutes: 30, elapsedMinutes: 45, responded: false, escalated: false },
    { id: 'k4', subject: 'Feature question', priority: 'low', slaMinutes: 240, elapsedMinutes: 300, responded: true, escalated: false },
    { id: 'k5', subject: 'Slow page loads', priority: 'high', slaMinutes: 60, elapsedMinutes: 70, responded: false, escalated: false },
  ]
  nextId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listTickets(filter?: { breached?: string | null }): Ticket[] {
  let out = tickets.slice()
  if (filter?.breached === 'true') out = out.filter((t) => isBreached(t))
  return out
}

export function createTicket(input: {
  subject: string
  priority?: Priority
  slaMinutes?: number
  elapsedMinutes?: number
}): Ticket {
  const ticket: Ticket = {
    id: `k${nextId++}`,
    subject: input.subject,
    priority: input.priority ?? 'normal',
    slaMinutes: input.slaMinutes ?? 120,
    elapsedMinutes: input.elapsedMinutes ?? 0,
    responded: false,
    escalated: false,
  }
  tickets.push(ticket)
  return ticket
}

export function findTicket(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === id)
}

export function respondTicket(id: string): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === id)
  if (!ticket) return undefined
  ticket.responded = true
  return ticket
}

export function escalateTicket(id: string): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === id)
  if (!ticket) return undefined
  ticket.escalated = true
  ticket.priority = bumpPriority(ticket.priority)
  return ticket
}

export function deleteTicket(id: string): boolean {
  const idx = tickets.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tickets.splice(idx, 1)
  return true
}
