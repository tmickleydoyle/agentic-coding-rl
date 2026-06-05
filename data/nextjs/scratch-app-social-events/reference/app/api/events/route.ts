import { createEvent, deleteEvent, findEvent, listEvents, updateEvent } from '../../../lib/store'
import type { Rsvp } from '../../../lib/types'

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

const isRsvp = (v: unknown): v is Rsvp => v === 'going' || v === 'maybe' || v === 'no'

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const events = listEvents({ when: params.get('when') })
  return json({ events })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const title = body.title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return json({ error: 'title required' }, 400)
  }
  const day = typeof body.day === 'number' ? body.day : undefined
  const event = createEvent({ title: title.trim(), day })
  return json(event, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findEvent(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (!isRsvp(body.rsvp)) {
    return json({ error: 'invalid rsvp' }, 400)
  }
  const updated = updateEvent(id, { rsvp: body.rsvp })
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEvent(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
