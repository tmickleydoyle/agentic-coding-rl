'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Item, Route, Theme } from '../lib/types'

type NewItemInput = {
  name: string
  aisle: string
  qty: number
}

type ShoppingApi = {
  items: Item[]
  history: Item[]
  theme: Theme
  route: Route
  addItem: (input: NewItemInput) => void
  toggleBought: (id: string) => void
  removeItem: (id: string) => void
  clearBought: () => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ShoppingContext = createContext<ShoppingApi | null>(null)

const STUB: ShoppingApi = {
  items: [],
  history: [],
  theme: 'light',
  route: 'list',
  addItem: () => {},
  toggleBought: () => {},
  removeItem: () => {},
  clearBought: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold items/history/theme/route in state (seed 4 items, empty history), implement
  // the actions (clearBought moves bought items into history), and provide them through
  // ShoppingContext. The STUB below makes the app mount but does nothing.
  return <ShoppingContext.Provider value={STUB}>{children}</ShoppingContext.Provider>
}

export function useShopping(): ShoppingApi {
  const v = useContext(ShoppingContext)
  if (!v) throw new Error('useShopping must be used within an AppStateProvider')
  return v
}
