'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { CartLine, CategoryFilter, Product, Route, Theme } from '../lib/types'

type ShopApi = {
  products: Product[]
  cart: CartLine[]
  theme: Theme
  route: Route
  selectedId: string | null
  categoryFilter: CategoryFilter
  maxPrice: number | null
  addToCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  selectProduct: (id: string) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setMaxPrice: (value: number | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ShopContext = createContext<ShopApi | null>(null)

const STUB: ShopApi = {
  products: [],
  cart: [],
  theme: 'light',
  route: 'catalog',
  selectedId: null,
  categoryFilter: 'all',
  maxPrice: null,
  addToCart: () => {},
  setQty: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  selectProduct: () => {},
  setCategoryFilter: () => {},
  setMaxPrice: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold products/cart/theme/route/selectedId/filters in state (seed 5 products),
  // implement the actions, and provide them through ShopContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <ShopContext.Provider value={STUB}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
