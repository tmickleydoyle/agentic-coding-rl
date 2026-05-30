import type { Coupon, CouponKind } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `coupons`; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isKind(value: unknown): value is CouponKind {
  return value === 'percent' || value === 'fixed'
}

export function listCoupons(_filter?: { kind?: string | null }): Coupon[] {
  // TODO: return coupons, applying an optional kind filter
  return []
}

export function findCoupon(_code: string): Coupon | undefined {
  // TODO: case-insensitive lookup by code
  return undefined
}

export function createCoupon(_input: {
  code: string
  kind: CouponKind
  amount: number
  minSpend?: number
}): Coupon {
  // TODO: append a new coupon (uppercased code) and return it
  return { code: '', kind: 'percent', amount: 0, minSpend: 0 }
}
