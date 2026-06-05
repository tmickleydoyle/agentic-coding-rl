'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Product, Route, Supplier, Theme } from '../lib/types'

type NewSupplierInput = {
  name: string
  category: string
  leadTimeDays: number
  rating?: number
}

type AppApi = {
  suppliers: Supplier[]
  products: Product[]
  theme: Theme
  route: Route
  categoryFilter: string
  selectedId: string | null
  addSupplier: (input: NewSupplierInput) => void
  setCategoryFilter: (c: string) => void
  selectSupplier: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Acme Parts', category: 'Hardware', leadTimeDays: 5, rating: 4.5 },
  { id: 's2', name: 'Global Foods', category: 'Food', leadTimeDays: 12, rating: 3.8 },
  { id: 's3', name: 'TextilePro', category: 'Apparel', leadTimeDays: 7, rating: 4.2 },
]

const SEED_PRODUCTS: Product[] = [
  { id: 'pr1', name: 'M4 Bolt', supplierId: 's1', price: 0.1 },
  { id: 'pr2', name: 'Steel Hinge', supplierId: 's1', price: 2.5 },
  { id: 'pr3', name: 'Olive Oil', supplierId: 's2', price: 9.0 },
  { id: 'pr4', name: 'Cotton Roll', supplierId: 's3', price: 14.0 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(SEED_SUPPLIERS)
  const [products] = useState<Product[]>(SEED_PRODUCTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('suppliers')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addSupplier = (input: NewSupplierInput) => {
      const id = `s${nextId}`
      setNextId((n) => n + 1)
      setSuppliers((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          category: input.category,
          leadTimeDays: input.leadTimeDays,
          rating: input.rating ?? 0,
        },
      ])
    }
    const navigate = (next: Route) => setRoute(next)
    const selectSupplier = (id: string) => {
      setSelectedId(id)
      setRoute('supplier-detail')
    }
    return {
      suppliers,
      products,
      theme,
      route,
      categoryFilter,
      selectedId,
      addSupplier,
      setCategoryFilter,
      selectSupplier,
      setTheme,
      navigate,
    }
  }, [suppliers, products, theme, route, categoryFilter, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
