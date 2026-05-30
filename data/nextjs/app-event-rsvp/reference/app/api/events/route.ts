import {
  createEvent,
  deleteEvent,
  isValidRsvp,
  listEvents,
  updateInvite,
} from '../../../lib/store'

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
  const id = new URL(req.url).searchParams.get('id')
  return json({ events: listEvents(id) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const name = body.name
  const date = typeof body.date === 'string' ? body.date : ''
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'invalid event' }, 400)
  }
  const event = createEvent({ name: name.trim(), date })
  return json(event, 201)
}

export async function PATCH(req: Request): Promise<Response> {
  const body = await readBody(req)
  const eventId = body.eventId
  const inviteId = body.inviteId
  const status = body.status
  const extraGuests = body.extraGuests
  if (typeof eventId !== 'string' || typeof inviteId !== 'string') {
    return json({ error: 'not found' }, 404)
  }
  if (
    typeof status !== 'string' ||
    !isValidRsvp(status) ||
    typeof extraGuests !== 'number' ||
    !Number.isInteger(extraGuests) ||
    extraGuests < 0
  ) {
    return json({ error: 'invalid rsvp' }, 400)
  }
  const invite = updateInvite(eventId, inviteId, status, extraGuests)
  if (!invite) return json({ error: 'not found' }, 404)
  return json(invite)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteEvent(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
