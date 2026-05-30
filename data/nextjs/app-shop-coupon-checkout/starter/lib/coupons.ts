import type { Coupon } from './types'

export type CouponResult = {
  discount: number
  total: number
  valid: boolean
  message: string
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function describeCoupon(_coupon: Coupon): string {
  // TODO: human description like "10% off" / "$5 off" (+ min-spend note when relevant)
  return ''
}

export function applyCoupon(subtotal: number, _coupon: Coupon | null): CouponResult {
  // TODO: no coupon => no discount; below minSpend => invalid with a message; otherwise
  // compute the percent/fixed discount, clamp to <= subtotal, round to 2, and return it.
  return { discount: 0, total: round2(subtotal), valid: true, message: '' }
}
