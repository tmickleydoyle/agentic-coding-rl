'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PRODUCTS: Product[] = [
  { id: 'w1', name: 'Aero Mug', category: 'kitchen', price: 12 },
  { id: 'w2', name: 'Desk Lamp', category: 'office', price: 30 },
  { id: 'w3', name: 'Notebook', category: 'office', price: 6 },
  { id: 'w4', name: 'Chef Knife', category: 'kitchen', price: 45 },
  { id: 'w5', name: 'Yoga Mat', category: 'fitness', price: 25 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(SEED_PRODUCTS)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('browse')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  const value = useMemo<ShopApi>(() => {
    const addOneToCart = (prev: CartLine[], productId: string): CartLine[] => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { productId, qty: 1 }]
    }

    const toggleWishlist = (productId: string) => {
      setWishlist((prev) =>
        prev.indexOf(productId) === -1 ? [...prev, productId] : prev.filter((id) => id !== productId),
      )
    }

    const removeFromWishlist = (productId: string) => {
      setWishlist((prev) => prev.filter((id) => id !== productId))
    }

    const addToCart = (productId: string) => {
      setCart((prev) => addOneToCart(prev, productId))
    }

    const moveToCart = (productId: string) => {
      setCart((prev) => addOneToCart(prev, productId))
      setWishlist((prev) => prev.filter((id) => id !== productId))
    }

    const removeFromCart = (productId: string) => {
      setCart((prev) => prev.filter((l) => l.productId !== productId))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      products,
      wishlist,
      cart,
      theme,
      route,
      categoryFilter,
      maxPrice,
      toggleWishlist,
      removeFromWishlist,
      moveToCart,
      addToCart,
      removeFromCart,
      setCategoryFilter,
      setMaxPrice,
      setTheme,
      navigate,
    }
  }, [products, wishlist, cart, theme, route, categoryFilter, maxPrice])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop(): ShopApi {
  const v = useContext(ShopContext)
  if (!v) throw new Error('useShop must be used within an AppStateProvider')
  return v
}
