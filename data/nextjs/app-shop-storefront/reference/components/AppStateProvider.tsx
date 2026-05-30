'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PRODUCTS: Product[] = [
  { id: 's1', name: 'Aero Mug', category: 'kitchen', price: 12 },
  { id: 's2', name: 'Desk Lamp', category: 'office', price: 30 },
  { id: 's3', name: 'Notebook', category: 'office', price: 6 },
  { id: 's4', name: 'Chef Knife', category: 'kitchen', price: 45 },
  { id: 's5', name: 'Yoga Mat', category: 'fitness', price: 25 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(SEED_PRODUCTS)
  const [cart, setCart] = useState<CartLine[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('catalog')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

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

    const clearCart = () => setCart([])

    const selectProduct = (id: string) => {
      setSelectedId(id)
      setRoute('product')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      products,
      cart,
      theme,
      route,
      selectedId,
      categoryFilter,
      maxPrice,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      selectProduct,
      setCategoryFilter,
      setMaxPrice,
      setTheme,
      navigate,
    }
  }, [products, cart, theme, route, selectedId, categoryFilter, maxPrice])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
