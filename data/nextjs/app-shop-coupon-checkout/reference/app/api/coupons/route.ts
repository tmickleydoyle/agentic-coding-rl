import { createCoupon, findCoupon, isKind, listCoupons } from '../../../lib/store'
import { applyCoupon } from '../../../lib/coupons'
import type { CouponKind } from '../../../lib/types'

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
  const code = params.get('code')
  if (code) {
    const coupon = findCoupon(code)
    if (!coupon) return json({ error: 'not found' }, 404)
    const subtotal = Number(params.get('subtotal') ?? '0')
    const result = applyCoupon(Number.isNaN(subtotal) ? 0 : subtotal, coupon)
    return json(result)
  }
  const coupons = listCoupons({ kind: params.get('kind') })
  return json({ coupons })
}

export async function POST(req: Request): Promise<Response> {
  const body = await readBody(req)
  const code = body.code
  if (typeof code !== 'string' || code.trim().length === 0) {
    return json({ error: 'code required' }, 400)
  }
  if (!isKind(body.kind)) {
    return json({ error: 'kind invalid' }, 400)
  }
  const amount = body.amount
  if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
    return json({ error: 'amount invalid' }, 400)
  }
  if (findCoupon(code)) {
    return json({ error: 'code exists' }, 409)
  }
  const minSpend = typeof body.minSpend === 'number' && body.minSpend >= 0 ? body.minSpend : 0
  const coupon = createCoupon({
    code: code.trim(),
    kind: body.kind as CouponKind,
    amount,
    minSpend,
  })
  return json(coupon, 201)
}
