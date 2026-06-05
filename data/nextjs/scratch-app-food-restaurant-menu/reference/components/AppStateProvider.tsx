'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_DISHES: Dish[] = [
  { id: 'd1', name: 'Bruschetta', category: 'Starter', price: 8, vegetarian: true },
  { id: 'd2', name: 'Caesar Salad', category: 'Starter', price: 10, vegetarian: false },
  { id: 'd3', name: 'Margherita', category: 'Main', price: 14, vegetarian: true },
  { id: 'd4', name: 'Ribeye Steak', category: 'Main', price: 28, vegetarian: false },
  { id: 'd5', name: 'Tiramisu', category: 'Dessert', price: 9, vegetarian: true },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [dishes] = useState<Dish[]>(SEED_DISHES)
  const [cart, setCart] = useState<CartLine[]>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('menu')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [vegOnly, setVegOnly] = useState(false)

  const value = useMemo<MenuApi>(() => {
    const addToCart = (dishId: string) => {
      setCart((prev) => {
        const line = prev.find((l) => l.dishId === dishId)
        if (line) return prev.map((l) => (l.dishId === dishId ? { ...l, qty: l.qty + 1 } : l))
        return [...prev, { dishId, qty: 1 }]
      })
    }

    const setQty = (dishId: string, qty: number) => {
      setCart((prev) => {
        if (qty <= 0) return prev.filter((l) => l.dishId !== dishId)
        const exists = prev.some((l) => l.dishId === dishId)
        if (!exists) return [...prev, { dishId, qty }]
        return prev.map((l) => (l.dishId === dishId ? { ...l, qty } : l))
      })
    }

    const removeFromCart = (dishId: string) => {
      setCart((prev) => prev.filter((l) => l.dishId !== dishId))
    }

    const clearCart = () => setCart([])

    const selectDish = (id: string) => {
      setSelectedId(id)
      setRoute('item-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      dishes,
      cart,
      theme,
      route,
      selectedId,
      categoryFilter,
      vegOnly,
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      selectDish,
      setCategoryFilter,
      setVegOnly,
      setTheme,
      navigate,
    }
  }, [dishes, cart, theme, route, selectedId, categoryFilter, vegOnly])

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu(): MenuApi {
  const v = useContext(MenuContext)
  if (!v) throw new Error('useMenu must be used within an AppStateProvider')
  return v
}
