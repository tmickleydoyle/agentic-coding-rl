'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Milk', aisle: 'Dairy', qty: 1, bought: false },
  { id: 'i2', name: 'Apples', aisle: 'Produce', qty: 6, bought: false },
  { id: 'i3', name: 'Cheddar', aisle: 'Dairy', qty: 1, bought: true },
  { id: 'i4', name: 'Bananas', aisle: 'Produce', qty: 3, bought: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(SEED_ITEMS)
  const [history, setHistory] = useState<Item[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('list')
  const [nextId, setNextId] = useState(5)

  const value = useMemo<ShoppingApi>(() => {
    const addItem = (input: NewItemInput) => {
      const id = `i${nextId}`
      setNextId((n) => n + 1)
      setItems((prev) => [
        ...prev,
        { id, name: input.name, aisle: input.aisle, qty: input.qty, bought: false },
      ])
    }

    const toggleBought = (id: string) => {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, bought: !i.bought } : i)))
    }

    const removeItem = (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }

    const clearBought = () => {
      setItems((prev) => {
        const bought = prev.filter((i) => i.bought)
        const keep = prev.filter((i) => !i.bought)
        if (bought.length > 0) setHistory((h) => [...bought, ...h])
        return keep
      })
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      items,
      history,
      theme,
      route,
      addItem,
      toggleBought,
      removeItem,
      clearBought,
      setTheme,
      navigate,
    }
  }, [items, history, theme, route, nextId])

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>
}

export function useShopping(): ShoppingApi {
  const v = useContext(ShoppingContext)
  if (!v) throw new Error('useShopping must be used within an AppStateProvider')
  return v
}
