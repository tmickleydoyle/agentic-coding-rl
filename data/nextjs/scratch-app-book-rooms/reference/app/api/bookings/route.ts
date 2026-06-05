import {
  createBooking,
  deleteBooking,
  hasConflict,
  listBookings,
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
  const params = new URL(req.url).searchParams
  const bookings = listBookings({ roomId: params.get('roomId') })
  return json({ bookings })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const roomId = body.roomId
  const title = body.title
  const start = body.start
  const end = body.end
  if (
    typeof roomId !== 'string' ||
    roomId.trim().length === 0 ||
    typeof title !== 'string' ||
    title.trim().length === 0 ||
    typeof start !== 'number' ||
    !Number.isFinite(start) ||
    typeof end !== 'number' ||
    !Number.isFinite(end) ||
    start >= end
  ) {
    return json({ error: 'invalid booking' }, 400)
  }
  if (hasConflict(roomId, start, end)) {
    return json({ error: 'conflict' }, 409)
  }
  const booking = createBooking({ roomId, start, end, title: title.trim() })
  return json(booking, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteBooking(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
