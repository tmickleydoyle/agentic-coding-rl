import {
  createOrder,
  deleteOrder,
  findEvent,
  findTier,
  listOrders,
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
  const eventId = new URL(req.url).searchParams.get('eventId')
  return json({ orders: listOrders(eventId) })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const eventId = body.eventId
  const tierId = body.tierId
  const buyer = body.buyer
  const qty = body.qty
  if (
    typeof eventId !== 'string' ||
    eventId.trim().length === 0 ||
    typeof tierId !== 'string' ||
    tierId.trim().length === 0 ||
    typeof buyer !== 'string' ||
    buyer.trim().length === 0 ||
    typeof qty !== 'number' ||
    !Number.isInteger(qty) ||
    qty <= 0
  ) {
    return json({ error: 'invalid order' }, 400)
  }
  const event = findEvent(eventId)
  const tier = findTier(eventId, tierId)
  if (!event || !tier) {
    return json({ error: 'not found' }, 404)
  }
  if (qty > tier.capacity - tier.sold) {
    return json({ error: 'sold out' }, 409)
  }
  const order = createOrder({ eventId, tierId, qty, buyer: buyer.trim() })
  return json(order, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteOrder(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
