'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Mug', price: 12, stock: 100 },
  { id: 'p2', name: 'T-shirt', price: 25, stock: 40 },
  { id: 'p3', name: 'Sticker', price: 3, stock: 500 },
]

const SEED_ORDERS: Order[] = [
  { id: 'o1', productId: 'p1', qty: 2, fulfilled: true },
  { id: 'o2', productId: 'p2', qty: 1, fulfilled: false },
  { id: 'o3', productId: 'p1', qty: 3, fulfilled: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS)
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('products')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addProduct = (input: NewProductInput) => {
      const id = `p${nextId}`
      setNextId((n) => n + 1)
      setProducts((prev) => [...prev, { ...input, id }])
    }

    const fulfillOrder = (id: string) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, fulfilled: true } : o)))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      products,
      orders,
      theme,
      route,
      addProduct,
      fulfillOrder,
      setTheme,
      navigate,
    }
  }, [products, orders, theme, route, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
