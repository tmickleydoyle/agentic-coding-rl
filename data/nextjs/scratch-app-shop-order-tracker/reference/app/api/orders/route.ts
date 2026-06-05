import { createOrder, findOrder, isStatus, listOrders, setStatus } from '../../../lib/store'
import type { OrderStatus } from '../../../lib/types'

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
  const orders = listOrders({ status: params.get('status') })
  return json({ orders })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const item = body.item
  if (typeof item !== 'string' || item.trim().length === 0) {
    return json({ error: 'item required' }, 400)
  }
  const total = body.total
  if (typeof total !== 'number' || Number.isNaN(total) || total < 0) {
    return json({ error: 'total invalid' }, 400)
  }
  const order = createOrder({ item: item.trim(), total })
  return json(order, 201)
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const existing = findOrder(id)
  if (!existing) return json({ error: 'not found' }, 404)
  const body = await readBody(req)
  if (!isStatus(body.status)) return json({ error: 'status invalid' }, 400)
  const updated = setStatus(id, body.status as OrderStatus)
  return json(updated)
}
