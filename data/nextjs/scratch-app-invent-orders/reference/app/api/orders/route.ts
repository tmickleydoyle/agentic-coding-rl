import {
  cancelOrder,
  createOrder,
  findOrder,
  listOrders,
  receiveOrder,
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
  const orders = listOrders({ supplier: params.get('supplier') })
  return json({ orders })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const supplier = body.supplier
  if (typeof supplier !== 'string' || supplier.trim().length === 0) {
    return json({ error: 'supplier required' }, 400)
  }
  const item = body.item
  if (typeof item !== 'string' || item.trim().length === 0) {
    return json({ error: 'item required' }, 400)
  }
  const ordered = body.ordered
  if (typeof ordered !== 'number' || Number.isNaN(ordered) || ordered <= 0) {
    return json({ error: 'ordered invalid' }, 400)
  }
  const order = createOrder({ supplier: supplier.trim(), item: item.trim(), ordered })
  return json(order, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const id = params.get('id') ?? ''
  const existing = findOrder(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const action = params.get('action') ?? 'receive'
  if (action === 'cancel') {
    return json(cancelOrder(id))
  }
  if (action === 'receive') {
    if (existing.cancelled) return json({ error: 'order cancelled' }, 409)
    const body = await readBody(req)
    const qty = body.qty
    if (typeof qty !== 'number' || Number.isNaN(qty) || qty <= 0) {
      return json({ error: 'qty invalid' }, 400)
    }
    return json(receiveOrder(id, qty))
  }
  return json({ error: 'action invalid' }, 400)
}
