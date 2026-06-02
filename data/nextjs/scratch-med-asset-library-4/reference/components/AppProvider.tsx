'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Asset, AssetType, Route } from '../lib/types'

const SEED: Asset[] = [
  { id: 1, name: 'Company Logo', type: 'logo', tags: 'brand, primary' },
  { id: 2, name: 'Menu Icon', type: 'icon', tags: 'nav, ui' },
  { id: 3, name: 'Hero Photo', type: 'photo', tags: 'landing, hero' },
]

type Ctx = {
  assets: Asset[]
  filterType: AssetType | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addAsset: (name: string, type: AssetType, tags: string) => void
  deleteAsset: (id: number) => void
  setFilterType: (f: AssetType | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(SEED)
  const [filterType, setFilterType] = useState<AssetType | 'all'>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('library')
  const [nextId, setNextId] = useState(4)

  function addAsset(name: string, type: AssetType, tags: string) {
    const n = name.trim()
    if (!n) return
    setAssets((a) => [...a, { id: nextId, name: n, type, tags: tags.trim() }])
    setNextId((i) => i + 1)
  }

  function deleteAsset(id: number) {
    setAssets((a) => a.filter((x) => x.id !== id))
  }

  const value: Ctx = {
    assets,
    filterType,
    theme,
    route,
    navigate: setRoute,
    addAsset,
    deleteAsset,
    setFilterType,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
