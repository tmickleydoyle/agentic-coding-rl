import {
  createExpense,
  deleteExpense,
  findTrip,
  listExpenses,
  listTrips,
  tripTotal,
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
    const expenses = listExpenses({ tripId, category: params.get('category') })
    return json({ trip, expenses, total: tripTotal(tripId) })
  }
  const trips = listTrips().map((t) => ({ ...t, total: tripTotal(t.id) }))
  return json({ trips })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const tripId = body.tripId
  if (typeof tripId !== 'string' || !findTrip(tripId)) {
    return json({ error: 'not found' }, 404)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || amount <= 0) {
    return json({ error: 'amount required' }, 400)
  }
  const day = typeof body.day === 'number' && body.day > 0 ? body.day : 1
  const category = isCategory(body.category) ? body.category : 'other'
  const note = typeof body.note === 'string' ? body.note : ''
  const expense = createExpense({ tripId, day, category, amount, note })
  return json(expense, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteExpense(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
