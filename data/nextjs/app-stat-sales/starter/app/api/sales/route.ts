import {
  createOrder,
  deleteOrder,
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

export async function GET(req: Request): Promise<Response> {
  // TODO: return { orders } applying ?region= and ?product= filters; ?summary=region|product
  // returns the matching rollup instead.
  void req
  void listOrders
  void summarizeByRegion
  void summarizeByProduct
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create an order from { product, region, revenue?, units?, month? }; 400 if product
  // blank or region invalid.
  void req
  void createOrder
  return json({ error: 'not implemented' }, 501)
}

export async function DELETE(req: Request): Promise<Response> {
  // TODO: ?id= delete; 404 if absent
  void req
  void deleteOrder
  return json({ error: 'not implemented' }, 501)
}
