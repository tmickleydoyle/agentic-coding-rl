import type { Priority, Reply, Ticket, TicketStatus } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let tickets: Ticket[] = []
let nextTicketId = 1
let nextReplyId = 1

function seed(): void {
  tickets = [
    {
      id: 'k1',
      subject: 'Cannot log in',
      requester: 'dana',
      priority: 'high',
      status: 'open',
      assignee: 'alice',
      replies: [{ id: 'r1', author: 'alice', body: 'Looking into it.' }],
    },
    {
      id: 'k2',
      subject: 'Billing question',
      requester: 'evan',
      priority: 'normal',
      status: 'pending',
      assignee: null,
      replies: [],
    },
    {
      id: 'k3',
      subject: 'Feature request: dark mode',
      requester: 'fran',
      priority: 'low',
      status: 'open',
      assignee: 'bob',
      replies: [],
    },
    {
      id: 'k4',
      subject: 'Payment failed',
      requester: 'gita',
      priority: 'urgent',
      status: 'resolved',
      assignee: 'alice',
      replies: [{ id: 'r2', author: 'alice', body: 'Refunded.' }],
    },
  ]
  nextTicketId = 5
  nextReplyId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listTickets(filter?: {
  status?: string | null
  priority?: string | null
  assignee?: string | null
}): Ticket[] {
  let out = tickets.slice()
  const status = filter?.status
  if (status === 'open' || status === 'pending' || status === 'resolved') {
    out = out.filter((t) => t.status === status)
  }
  const priority = filter?.priority
  if (priority === 'low' || priority === 'normal' || priority === 'high' || priority === 'urgent') {
    out = out.filter((t) => t.priority === priority)
  }
  const assignee = filter?.assignee
  if (assignee === 'unassigned') out = out.filter((t) => t.assignee === null)
  else if (assignee) out = out.filter((t) => t.assignee === assignee)
  return out
}

export function createTicket(input: {
  subject: string
  requester?: string
  priority?: Priority
}): Ticket {
  const ticket: Ticket = {
    id: `k${nextTicketId++}`,
    subject: input.subject,
    requester: input.requester ?? 'anonymous',
    priority: input.priority ?? 'normal',
    status: 'open',
    assignee: null,
    replies: [],
  }
  tickets.push(ticket)
  return ticket
}

export function findTicket(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === id)
}

export function updateTicket(
  id: string,
  patch: { assignee?: string | null; status?: TicketStatus; priority?: Priority },
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === id)
  if (!ticket) return undefined
  if (patch.assignee !== undefined) ticket.assignee = patch.assignee
  if (patch.status) ticket.status = patch.status
  if (patch.priority) ticket.priority = patch.priority
  return ticket
}

export function addReply(
  id: string,
  input: { author: string; body: string },
): Ticket | undefined {
  const ticket = tickets.find((t) => t.id === id)
  if (!ticket) return undefined
  const r: Reply = { id: `r${nextReplyId++}`, author: input.author, body: input.body }
  ticket.replies.push(r)
  return ticket
}

export function deleteTicket(id: string): boolean {
  const idx = tickets.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tickets.splice(idx, 1)
  return true
}
