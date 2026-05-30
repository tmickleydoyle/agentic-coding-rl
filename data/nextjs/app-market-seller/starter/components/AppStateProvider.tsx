'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Order, Product, Route, Theme } from '../lib/types'

type NewProductInput = {
  name: string
  price: number
  stock: number
}

type AppApi = {
  products: Product[]
  orders: Order[]
  theme: Theme
  route: Route
  addProduct: (input: NewProductInput) => void
  fulfillOrder: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  products: [],
  orders: [],
  theme: 'light',
  route: 'products',
  addProduct: () => {},
  fulfillOrder: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold products/orders/theme/route in state (seed 3 products + 3 orders),
  // implement addProduct, fulfillOrder, navigate. The STUB below makes the app mount but
  // does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
