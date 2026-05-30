'use client'
import type { Coupon } from '../lib/types'

export default function CouponCard(_props: { coupon: Coupon }) {
  // TODO: render the coupon code and a human description.
  return <li data-testid={`coupon-${_props.coupon.code}`} />
}
