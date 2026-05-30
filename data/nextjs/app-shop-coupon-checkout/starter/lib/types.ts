export type Product = {
  id: string
  name: string
  price: number
}

export type CartLine = {
  productId: string
  qty: number
}

export type CouponKind = 'percent' | 'fixed'

export type Coupon = {
  code: string
  kind: CouponKind
  amount: number
  minSpend: number
}

export type Route = 'cart' | 'coupons' | 'checkout' | 'confirmation'
export type Theme = 'light' | 'dark'
