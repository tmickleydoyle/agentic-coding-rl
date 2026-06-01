'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PRODUCTS: Product[] = [
  { id: 'c1', name: 'Aero Mug', price: 12 },
  { id: 'c2', name: 'Desk Lamp', price: 30 },
  { id: 'c3', name: 'Notebook', price: 6 },
  { id: 'c4', name: 'Chef Knife', price: 45 },
]

const SEED_COUPONS: Coupon[] = [
  { code: 'SAVE10', kind: 'percent', amount: 10, minSpend: 0 },
  { code: 'FLAT5', kind: 'fixed', amount: 5, minSpend: 0 },
  { code: 'BIG20', kind: 'percent', amount: 20, minSpend: 50 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(SEED_PRODUCTS)
  const [coupons] = useState<Coupon[]>(SEED_COUPONS)
  const [cart, setCart] = useState<CartLine[]>([])
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('cart')

  const value = useMemo<ShopApi>(() => {
    const addToCart = (productId: string) => {
      setCart((prev) => {
        const existing = prev.find((l) => l.productId === productId)
        if (existing) {
          return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
        }
        return [...prev, { productId, qty: 1 }]
      })
    }

    const setQty = (productId: string, qty: number) => {
      setCart((prev) => {
        if (qty <= 0) return prev.filter((l) => l.productId !== productId)
        const existing = prev.find((l) => l.productId === productId)
        if (!existing) return [...prev, { productId, qty }]
        return prev.map((l) => (l.productId === productId ? { ...l, qty } : l))
      })
    }

    const removeFromCart = (productId: string) => {
      setCart((prev) => prev.filter((l) => l.productId !== productId))
    }

    const applyCode = (code: string) => {
      const upper = code.trim().toUpperCase()
      const found = coupons.find((c) => c.code === upper)
      setAppliedCode(found ? found.code : null)
    }

    const clearCoupon = () => setAppliedCode(null)

    const navigate = (next: Route) => setRoute(next)

    return {
      products,
      cart,
      coupons,
      appliedCode,
      theme,
      route,
      addToCart,
      setQty,
      removeFromCart,
      applyCode,
      clearCoupon,
      setTheme,
      navigate,
    }
  }, [products, coupons, cart, appliedCode, theme, route])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
