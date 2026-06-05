'use client'
import { useShop } from '../components/AppStateProvider'
import { applyCoupon, round2 } from '../lib/coupons'
import type { Coupon } from '../lib/types'

export type JoinedLine = {
  productId: string
  name: string
  price: number
  qty: number
  subtotal: number
}

export function useCheckout() {
  const { cart, products, coupons, appliedCode } = useShop()
  const lines: JoinedLine[] = []
  cart.forEach((l) => {
    const p = products.find((x) => x.id === l.productId)
    if (p) {
      lines.push({
        productId: p.id,
        name: p.name,
        price: p.price,
        qty: l.qty,
        subtotal: round2(p.price * l.qty),
      })
    }
  })
  const count = cart.reduce((sum, l) => sum + l.qty, 0)
  const subtotal = round2(lines.reduce((sum, l) => sum + l.subtotal, 0))
  const appliedCoupon: Coupon | null =
    appliedCode === null ? null : coupons.find((c) => c.code === appliedCode) ?? null
  const result = applyCoupon(subtotal, appliedCoupon)
  return {
    lines,
    count,
    subtotal,
    appliedCoupon,
    discount: result.discount,
    total: result.total,
    couponValid: result.valid,
    couponMessage: result.message,
  }
}
