import {
  createOrder,
  deleteOrder,
  isRegion,
  listOrders,
  summarizeByProduct,
  summarizeByRegion,
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
  const orders = listOrders({
    region: params.get('region'),
    product: params.get('product'),
  })
  const summary = params.get('summary')
  if (summary === 'region') return json({ summary: summarizeByRegion(orders) })
  if (summary === 'product') return json({ summary: summarizeByProduct(orders) })
  return json({ orders })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const product = body.product
  if (typeof product !== 'string' || product.trim().length === 0) {
    return json({ error: 'product required' }, 400)
  }
  if (!isRegion(body.region)) {
    return json({ error: 'valid region required' }, 400)
  }
  const num = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined)
  const month = typeof body.month === 'string' ? body.month : undefined
  const order = createOrder({
    product: product.trim(),
    region: body.region,
    revenue: num(body.revenue),
    units: num(body.units),
    month,
  })
  return json(order, 201)
}

export async function DELETE(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const ok = deleteOrder(id)
  if (!ok) return json({ error: 'not found' }, 404)
  return json({ ok: true })
}
