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

export function describeCoupon(coupon: Coupon): string {
  const base =
    coupon.kind === 'percent' ? `${coupon.amount}% off` : `$${coupon.amount} off`
  if (coupon.minSpend > 0) return `${base} (min spend ${coupon.minSpend})`
  return base
}

export function applyCoupon(subtotal: number, coupon: Coupon | null): CouponResult {
  if (!coupon) {
    return { discount: 0, total: round2(subtotal), valid: true, message: '' }
  }
  if (subtotal < coupon.minSpend) {
    return {
      discount: 0,
      total: round2(subtotal),
      valid: false,
      message: `Spend at least ${coupon.minSpend} to use this coupon`,
    }
  }
  let raw = coupon.kind === 'percent' ? (subtotal * coupon.amount) / 100 : coupon.amount
  if (raw > subtotal) raw = subtotal
  if (raw < 0) raw = 0
  const discount = round2(raw)
  return {
    discount,
    total: round2(subtotal - discount),
    valid: true,
    message: 'Coupon applied',
  }
}
