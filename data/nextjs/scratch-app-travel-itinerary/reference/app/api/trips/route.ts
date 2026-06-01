import {
  createActivity,
  createTrip,
  deleteActivity,
  findTrip,
  listActivities,
  listTrips,
  tripCost,
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
  const tripId = params.get('tripId')
  if (tripId) {
    const trip = findTrip(tripId)
    if (!trip) return json({ error: 'not found' }, 404)
    const activities = listActivities({ tripId })
    return json({ trip, activities, cost: tripCost(tripId) })
  }
  const trips = listTrips().map((t) => ({ ...t, cost: tripCost(t.id) }))
  return json({ trips })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  // Creating an activity when a tripId is supplied in the body; otherwise a trip.
  if (typeof body.tripId === 'string') {
    const trip = findTrip(body.tripId)
    if (!trip) return json({ error: 'not found' }, 404)
    const title = body.title
    if (typeof title !== 'string' || title.trim().length === 0) {
      return json({ error: 'title required' }, 400)
    }
    const day = typeof body.day === 'number' && body.day > 0 ? body.day : 1
    const cost = typeof body.cost === 'number' && body.cost >= 0 ? body.cost : 0
    const activity = createActivity({ tripId: body.tripId, day, title: title.trim(), cost })
    return json(activity, 201)
  }
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const destination = typeof body.destination === 'string' ? body.destination : ''
  const days = typeof body.days === 'number' ? body.days : 1
  const trip = createTrip({ name: name.trim(), destination, days })
  return json(trip, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('activityId') ?? ''
  const ok = deleteActivity(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
