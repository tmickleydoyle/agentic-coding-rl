'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { CartLine, CategoryFilter, Product, Route, Theme } from '../lib/types'

type ShopApi = {
  products: Product[]
  wishlist: string[]
  cart: CartLine[]
  theme: Theme
  route: Route
  categoryFilter: CategoryFilter
  maxPrice: number | null
  toggleWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  moveToCart: (productId: string) => void
  addToCart: (productId: string) => void
  removeFromCart: (productId: string) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setMaxPrice: (value: number | null) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ShopContext = createContext<ShopApi | null>(null)

const STUB: ShopApi = {
  products: [],
  wishlist: [],
  cart: [],
  theme: 'light',
  route: 'browse',
  categoryFilter: 'all',
  maxPrice: null,
  toggleWishlist: () => {},
  removeFromWishlist: () => {},
  moveToCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  setCategoryFilter: () => {},
  setMaxPrice: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold products/wishlist/cart/theme/route/filters in state (seed 5 products),
  // implement the actions, and provide them through ShopContext. The STUB below makes the
  // app mount but does nothing — replace it with real state + actions.
  return <ShopContext.Provider value={STUB}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
