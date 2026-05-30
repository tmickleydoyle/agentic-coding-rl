import { fulfillOrder, listOrders } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { orders } applying ?fulfilled= filter
  void req
  void listOrders
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= mark fulfilled; 404 if absent
  void req
  void fulfillOrder
  return json({ error: 'not implemented' }, 501)
}
