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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { orders } applying an optional ?supplier= filter
  void req
  void listOrders
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an order from { supplier, item, ordered }; 400 on bad fields
  void req
  void createOrder
  return json({ error: 'not implemented' }, 501)
}

export async function PUT(req: Request): Promise<Response> {
  // TODO: ?id= with ?action=cancel cancels; otherwise receive { qty }; 400/404/409 per spec
  void req
  void findOrder
  void receiveOrder
  void cancelOrder
  return json({ error: 'not implemented' }, 501)
}
