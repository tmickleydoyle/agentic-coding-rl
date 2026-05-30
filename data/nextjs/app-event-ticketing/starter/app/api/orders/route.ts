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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { orders } applying an optional ?eventId= filter
  void req
  void listOrders
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an order; 400 invalid, 404 unknown event/tier, 409 sold out
  void req
  void createOrder
  void findEvent
  void findTier
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteOrder
  return json({ error: 'not implemented' }, 501)
}
