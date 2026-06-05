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
  removeColor: (id: number) => void
  clearColors: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: BrandColor[] = [
  { id: 1, name: 'Midnight Blue', hex: '#003366' },
  { id: 2, name: 'Coral', hex: '#FF6B6B' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<BrandColor[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('colors')
  const [nextId, setNextId] = useState(3)

  function addColor(name: string, hex: string) {
    const n = name.trim()
    const h = hex.trim()
    if (!n || !h) return
    setColors((c) => [...c, { id: nextId, name: n, hex: h }])
    setNextId((id) => id + 1)
  }

  function removeColor(id: number) {
    setColors((c) => c.filter((x) => x.id !== id))
  }

  function clearColors() {
    setColors([])
  }

  const value: Ctx = {
    colors,
    theme,
    route,
    navigate: setRoute,
    addColor,
    removeColor,
    clearColors,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
