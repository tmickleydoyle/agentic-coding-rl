import type { Coupon, CouponKind } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let coupons: Coupon[] = []

function seed(): void {
  coupons = [
    { code: 'SAVE10', kind: 'percent', amount: 10, minSpend: 0 },
    { code: 'FLAT5', kind: 'fixed', amount: 5, minSpend: 0 },
    { code: 'BIG20', kind: 'percent', amount: 20, minSpend: 50 },
  ]
}

seed()

export function __reset(): void {
  seed()
}

export function isKind(value: unknown): value is CouponKind {
  return value === 'percent' || value === 'fixed'
}

export function listCoupons(filter?: { kind?: string | null }): Coupon[] {
  let out = coupons.slice()
  const kind = filter?.kind
  if (kind && isKind(kind)) out = out.filter((c) => c.kind === kind)
  return out
}

export function findCoupon(code: string): Coupon | undefined {
  const upper = code.toUpperCase()
  return coupons.find((c) => c.code === upper)
}

export function createCoupon(input: {
  code: string
  kind: CouponKind
  amount: number
  minSpend?: number
}): Coupon {
  const coupon: Coupon = {
    code: input.code.toUpperCase(),
    kind: input.kind,
    amount: input.amount,
    minSpend: input.minSpend ?? 0,
  }
  coupons.push(coupon)
  return coupon
}
