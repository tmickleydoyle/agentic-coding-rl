'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Asset, AssetType, Route } from '../lib/types'

type Ctx = {
  assets: Asset[]
  theme: 'light' | 'dark'
  route: Route
  activeFilter: AssetType | 'all'
  navigate: (r: Route) => void
  addAsset: (name: string, type: AssetType, tags: string) => void
  deleteAsset: (id: number) => void
  setFilter: (f: AssetType | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Asset[] = [
  { id: 1, name: 'Wordmark', type: 'logo', tags: 'brand, primary' },
  { id: 2, name: 'Favicon', type: 'icon', tags: 'brand, small' },
  { id: 3, name: 'Hero Shot', type: 'photo', tags: 'homepage' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('library')
  const [activeFilter, setActiveFilter] = useState<AssetType | 'all'>('all')
  const [nextId, setNextId] = useState(4)

  function addAsset(name: string, type: AssetType, tags: string) {
    const n = name.trim()
    if (!n) return
    setAssets((prev) => [...prev, { id: nextId, name: n, type, tags: tags.trim() }])
    setNextId((id) => id + 1)
  }

  function deleteAsset(id: number) {
    setAssets((prev) => prev.filter((a) => a.id !== id))
  }

  const value: Ctx = {
    assets,
    theme,
    route,
    activeFilter,
    navigate: setRoute,
    addAsset,
    deleteAsset,
    setFilter: setActiveFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
