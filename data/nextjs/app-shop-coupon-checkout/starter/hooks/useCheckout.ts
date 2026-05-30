'use client'
import { useShop } from '../components/AppStateProvider'
import type { Coupon } from '../lib/types'

export type JoinedLine = {
  productId: string
  name: string
  price: number
  qty: number
  subtotal: number
}

export function useCheckout() {
  // TODO: join cart lines to products (subtotal = price*qty), compute count + subtotal,
  // resolve the applied coupon, and run applyCoupon(subtotal, coupon) for discount/total/
  // couponValid/couponMessage.
  useShop()
  return {
    lines: [] as JoinedLine[],
    count: 0,
    subtotal: 0,
    appliedCoupon: null as Coupon | null,
    discount: 0,
    total: 0,
    couponValid: true,
    couponMessage: '',
  }
}
