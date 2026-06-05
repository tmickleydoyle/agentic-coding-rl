'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Color, Route } from '../lib/types'

const SEED: Color[] = [
  { id: 1, name: 'Midnight Blue', hex: '#003153' },
  { id: 2, name: 'Crimson', hex: '#DC143C' },
  { id: 3, name: 'Forest Green', hex: '#228B22' },
]

type Ctx = {
  colors: Color[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addColor: (name: string, hex: string) => void
  deleteColor: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<Color[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('palette')
  const [nextId, setNextId] = useState(4)

  function addColor(name: string, hex: string) {
    const n = name.trim()
    const h = hex.trim()
    if (!n || !h) return
    setColors((c) => [...c, { id: nextId, name: n, hex: h }])
    setNextId((id) => id + 1)
  }

  function deleteColor(id: number) {
    setColors((c) => c.filter((x) => x.id !== id))
  }

  function clearAll() {
    setColors([])
  }

  const value: Ctx = {
    colors,
    theme,
    route,
    navigate: setRoute,
    addColor,
    deleteColor,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
