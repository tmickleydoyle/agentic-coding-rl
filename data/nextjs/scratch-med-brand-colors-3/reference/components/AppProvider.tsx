'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { BrandColor, Route } from '../lib/types'

type Ctx = {
  colors: BrandColor[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addColor: (name: string, hex: string) => void
  deleteColor: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<BrandColor[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('colors')
  const [nextId, setNextId] = useState(1)

  function addColor(name: string, hex: string) {
    const n = name.trim()
    const h = hex.trim()
    if (!n || !h) return
    if (!h.startsWith('#')) return
    setColors((c) => [...c, { id: nextId, name: n, hex: h }])
    setNextId((i) => i + 1)
  }

  function deleteColor(id: number) {
    setColors((c) => c.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    colors,
    theme,
    route,
    navigate: setRoute,
    addColor,
    deleteColor,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
