import {
  addReply,
  createTicket,
  deleteTicket,
  findTicket,
  listTickets,
  updateTicket,
} from '../../../lib/store'
import type { Priority, TicketStatus } from '../../../lib/types'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const readBody = async (req: Request): Promise<Record<string, unknown>> => {
  try {
    const b = await req.json()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const tickets = listTickets({
    status: params.get('status'),
    priority: params.get('priority'),
    assignee: params.get('assignee'),
  })
  return json({ tickets })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const subject = body.subject
  if (typeof subject !== 'string' || subject.trim().length === 0) {
    return json({ error: 'subject required' }, 400)
  }
  const requester = typeof body.requester === 'string' ? body.requester : undefined
  const priority = typeof body.priority === 'string' ? (body.priority as Priority) : undefined
  const ticket = createTicket({ subject: subject.trim(), requester, priority })
  return json(ticket, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findTicket(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (typeof body.replyBody === 'string' && body.replyBody.trim().length > 0) {
    const author = typeof body.author === 'string' ? body.author : 'agent'
    const updated = addReply(id, { author, body: body.replyBody.trim() })
    return json(updated)
  }
  const patch: { assignee?: string | null; status?: TicketStatus; priority?: Priority } = {}
  if (typeof body.assignee === 'string' || body.assignee === null) {
    patch.assignee = body.assignee as string | null
  }
  if (typeof body.status === 'string') patch.status = body.status as TicketStatus
  if (typeof body.priority === 'string') patch.priority = body.priority as Priority
  const updated = updateTicket(id, patch)
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteTicket(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
