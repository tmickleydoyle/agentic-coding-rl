'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ColorEntry, Route } from '../lib/types'

type Ctx = {
  colors: ColorEntry[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addColor: (name: string, hex: string) => void
  deleteColor: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: ColorEntry[] = [
  { id: 1, name: 'Primary Blue', hex: '#0057FF' },
  { id: 2, name: 'Accent Green', hex: '#00C48C' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ColorEntry[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('colors')
  const [nextId, setNextId] = useState(3)

  function addColor(name: string, hex: string) {
    const n = name.trim()
    const h = hex.trim()
    if (!n || !h) return
    setColors((c) => [...c, { id: nextId, name: n, hex: h }])
    setNextId((x) => x + 1)
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
