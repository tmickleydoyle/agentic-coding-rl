'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { CartLine, Coupon, Product, Route, Theme } from '../lib/types'

type ShopApi = {
  products: Product[]
  cart: CartLine[]
  coupons: Coupon[]
  appliedCode: string | null
  theme: Theme
  route: Route
  addToCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  applyCode: (code: string) => void
  clearCoupon: () => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ShopContext = createContext<ShopApi | null>(null)

const STUB: ShopApi = {
  products: [],
  cart: [],
  coupons: [],
  appliedCode: null,
  theme: 'light',
  route: 'cart',
  addToCart: () => {},
  setQty: () => {},
  removeFromCart: () => {},
  applyCode: () => {},
  clearCoupon: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold products/coupons/cart/appliedCode/theme/route in state (seed 4 products +
  // 3 coupons), implement the actions, and provide them through ShopContext. The STUB
  // below makes the app mount but does nothing.
  return <ShopContext.Provider value={STUB}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
