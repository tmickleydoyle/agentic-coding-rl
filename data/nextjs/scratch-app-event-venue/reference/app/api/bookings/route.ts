import {
  createBooking,
  deleteBooking,
  findVenue,
  isBooked,
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
  const bookings = listBookings({
    venueId: params.get('venueId'),
    date: params.get('date'),
  })
  return json({ bookings })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const venueId = body.venueId
  const date = body.date
  const organizer = body.organizer
  const attendees = body.attendees
  if (
    typeof venueId !== 'string' ||
    venueId.trim().length === 0 ||
    typeof date !== 'string' ||
    date.trim().length === 0 ||
    typeof organizer !== 'string' ||
    organizer.trim().length === 0 ||
    typeof attendees !== 'number' ||
    !Number.isInteger(attendees) ||
    attendees <= 0
  ) {
    return json({ error: 'invalid booking' }, 400)
  }
  const venue = findVenue(venueId)
  if (!venue) {
    return json({ error: 'not found' }, 404)
  }
  if (attendees > venue.capacity) {
    return json({ error: 'over capacity' }, 422)
  }
  if (isBooked(venueId, date)) {
    return json({ error: 'date taken' }, 409)
  }
  const booking = createBooking({ venueId, date, attendees, organizer: organizer.trim() })
  return json(booking, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteBooking(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
