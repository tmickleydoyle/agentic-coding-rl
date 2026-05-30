'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { CartLine, CategoryFilter, Dish, Route, Theme } from '../lib/types'

type MenuApi = {
  dishes: Dish[]
  cart: CartLine[]
  theme: Theme
  route: Route
  selectedId: string | null
  categoryFilter: CategoryFilter
  vegOnly: boolean
  addToCart: (dishId: string) => void
  setQty: (dishId: string, qty: number) => void
  removeFromCart: (dishId: string) => void
  clearCart: () => void
  selectDish: (id: string) => void
  setCategoryFilter: (filter: CategoryFilter) => void
  setVegOnly: (value: boolean) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const MenuContext = createContext<MenuApi | null>(null)

const STUB: MenuApi = {
  dishes: [],
  cart: [],
  theme: 'light',
  route: 'menu',
  selectedId: null,
  categoryFilter: 'all',
  vegOnly: false,
  addToCart: () => {},
  setQty: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  selectDish: () => {},
  setCategoryFilter: () => {},
  setVegOnly: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold dishes/cart/theme/route/selectedId/filters in state (seed 5 dishes), implement
  // the actions, and provide them through MenuContext. The STUB below makes the app mount but
  // does nothing — replace it with real state + actions.
  return <MenuContext.Provider value={STUB}>{children}</MenuContext.Provider>
}

export function useMenu(): MenuApi {
  const v = useContext(MenuContext)
  if (!v) throw new Error('useMenu must be used within an AppStateProvider')
  return v
}
