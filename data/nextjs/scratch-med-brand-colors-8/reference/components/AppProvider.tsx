'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ColorEntry, Route } from '../lib/types'

type Ctx = {
  colors: ColorEntry[]
  theme: 'light' | 'dark'
  filterShortHex: boolean
  route: Route
  navigate: (r: Route) => void
  addColor: (name: string, hex: string) => void
  deleteColor: (id: number) => void
  toggleTheme: () => void
  toggleFilterShortHex: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const INITIAL: ColorEntry[] = [
  { id: 1, name: 'Midnight Blue', hex: '#003153' },
  { id: 2, name: 'Coral', hex: '#FF6B6B' },
  { id: 3, name: 'Mint', hex: '#98FF98' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ColorEntry[]>(INITIAL)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [filterShortHex, setFilterShortHex] = useState(false)
  const [route, setRoute] = useState<Route>('colors')
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

  const value: Ctx = {
    colors,
    theme,
    filterShortHex,
    route,
    navigate: setRoute,
    addColor,
    deleteColor,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleFilterShortHex: () => setFilterShortHex((f) => !f),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
