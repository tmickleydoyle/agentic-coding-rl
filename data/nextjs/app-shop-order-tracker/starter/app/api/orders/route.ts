import { createOrder, findOrder, listOrders, setStatus } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: return { orders } applying an optional ?status= filter
  void req
  void listOrders
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a placed order from { item, total }; 400 on bad item/total
  void req
  void createOrder
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= set { status }; 400 on bad status; 404 if absent
  void req
  void findOrder
  void setStatus
  return json({ error: 'not implemented' }, 501)
}
