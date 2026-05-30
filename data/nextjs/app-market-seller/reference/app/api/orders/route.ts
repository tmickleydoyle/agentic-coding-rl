import { fulfillOrder, listOrders } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  const params = new URL(req.url).searchParams
  const orders = listOrders({ fulfilled: params.get('fulfilled') })
  return json({ orders })
}

export async function PUT(req: Request): Promise<Response> {
  const id = new URL(req.url).searchParams.get('id') ?? ''
  const updated = fulfillOrder(id)
  if (!updated) return json({ error: 'not found' }, 404)
  return json(updated)
}
