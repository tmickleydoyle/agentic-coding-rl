'use client'
import type { Coupon } from '../lib/types'
import { describeCoupon } from '../lib/coupons'

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  return (
    <li data-testid={`coupon-${coupon.code}`}>
      <span data-testid={`coupon-${coupon.code}-code`}>{coupon.code}</span>
      <span data-testid={`coupon-${coupon.code}-desc`}>{describeCoupon(coupon)}</span>
    </li>
  )
}
