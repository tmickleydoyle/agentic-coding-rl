'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ColorEntry, Route } from '../lib/types'

type Ctx = {
  colors: ColorEntry[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addColor: (name: string, hex: string) => void
  deleteColor: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: ColorEntry[] = [
  { id: 1, name: 'Primary', hex: '#0057FF' },
  { id: 2, name: 'Secondary', hex: '#FF5733' },
  { id: 3, name: 'Accent', hex: '#00C49A' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ColorEntry[]>(SEED)
  const [route, setRoute] = useState<Route>('colors')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addColor(name: string, hex: string) {
    const n = name.trim()
    const h = hex.trim()
    if (!n || !h) return
    setColors((c) => [...c, { id: nextId, name: n, hex: h }])
    setNextId((i) => i + 1)
  }

  function deleteColor(id: number) {
    setColors((c) => c.filter((x) => x.id !== id))
  }

  function clearAll() {
    setColors([])
  }

  const value: Ctx = {
    colors,
    route,
    theme,
    navigate: setRoute,
    addColor,
    deleteColor,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
