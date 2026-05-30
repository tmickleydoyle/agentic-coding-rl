import { createCoupon, findCoupon, listCoupons } from '../../../lib/store'

export { __reset } from '../../../lib/store'

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export async function GET(req: Request): Promise<Response> {
  // TODO: list coupons (?kind=), or validate ?code=&subtotal= (404 on unknown code)
  void req
  void listCoupons
  void findCoupon
  return json({ error: 'not implemented' }, 501)
}

export async function POST(req: Request): Promise<Response> {
  // TODO: create a coupon; 400 on bad code/kind/amount; 409 on duplicate code
  void req
  void createCoupon
  return json({ error: 'not implemented' }, 501)
}
