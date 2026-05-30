import {
  createItem,
  deleteItem,
  findItem,
  findTrip,
  listItems,
  listTrips,
  packedPercent,
  updateItem,
} from '../../../lib/store'
import type { Category } from '../../../lib/types'
import { CATEGORIES } from '../../../lib/types'

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

const isCategory = (v: unknown): v is Category =>
  typeof v === 'string' && (CATEGORIES as string[]).includes(v)

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const tripId = params.get('tripId')
  if (tripId) {
    const trip = findTrip(tripId)
    if (!trip) return json({ error: 'not found' }, 404)
    const items = listItems({ tripId })
    return json({ trip, items, percent: packedPercent(tripId) })
  }
  const trips = listTrips().map((t) => ({ ...t, percent: packedPercent(t.id) }))
  return json({ trips })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const tripId = body.tripId
  if (typeof tripId !== 'string' || !findTrip(tripId)) {
    return json({ error: 'not found' }, 404)
  }
  const name = body.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'name required' }, 400)
  }
  const category = isCategory(body.category) ? body.category : 'other'
  const item = createItem({ tripId, name: name.trim(), category })
  return json(item, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findItem(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  const packed = typeof body.packed === 'boolean' ? body.packed : !existing.packed
  const updated = updateItem(id, { packed })
  return json(updated)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteItem(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
