import {
  createTicket,
  deleteTicket,
  escalateTicket,
  findTicket,
  listTickets,
  respondTicket,
} from '../../../lib/store'
import type { Priority } from '../../../lib/types'

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
  const tickets = listTickets({ breached: params.get('breached') })
  return json({ tickets })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const subject = body.subject
  if (typeof subject !== 'string' || subject.trim().length === 0) {
    return json({ error: 'subject required' }, 400)
  }
  const priority = typeof body.priority === 'string' ? (body.priority as Priority) : undefined
  const slaMinutes = typeof body.slaMinutes === 'number' ? body.slaMinutes : undefined
  const elapsedMinutes = typeof body.elapsedMinutes === 'number' ? body.elapsedMinutes : undefined
  const ticket = createTicket({ subject: subject.trim(), priority, slaMinutes, elapsedMinutes })
  return json(ticket, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findTicket(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (body.action === 'respond') return json(respondTicket(id))
  if (body.action === 'escalate') return json(escalateTicket(id))
  return json({ error: 'unknown action' }, 400)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteTicket(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
