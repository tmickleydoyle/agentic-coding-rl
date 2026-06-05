'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ApiKey, Route, Scope, StatusFilter, Theme } from '../lib/types'

type NewKeyInput = {
  name: string
  scopes: Scope[]
}

type AppApi = {
  keys: ApiKey[]
  theme: Theme
  route: Route
  selectedKeyId: string | null
  statusFilter: StatusFilter
  createKey: (input: NewKeyInput) => void
  revokeKey: (id: string) => void
  recordUsage: (id: string) => void
  selectKey: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_KEYS: ApiKey[] = [
  { id: 'k1', name: 'CI deploy', secret: 'sk_live_aaaa1111', scopes: ['read', 'write'], active: true, usageCount: 12 },
  { id: 'k2', name: 'Read only', secret: 'sk_live_bbbb2222', scopes: ['read'], active: true, usageCount: 4 },
  { id: 'k3', name: 'Legacy admin', secret: 'sk_live_cccc3333', scopes: ['admin'], active: false, usageCount: 99 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<ApiKey[]>(SEED_KEYS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('keys')
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const createKey = (input: NewKeyInput) => {
      const id = `k${nextId}`
      setNextId((n) => n + 1)
      setKeys((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          secret: `sk_${id}_secret`,
          scopes: input.scopes,
          active: true,
          usageCount: 0,
        },
      ])
    }
    const revokeKey = (id: string) => {
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, active: false } : k)))
    }
    const recordUsage = (id: string) => {
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, usageCount: k.usageCount + 1 } : k)))
    }
    const selectKey = (id: string) => {
      setSelectedKeyId(id)
      setRoute('key-detail')
    }
    const navigate = (next: Route) => setRoute(next)

    return {
      keys,
      theme,
      route,
      selectedKeyId,
      statusFilter,
      createKey,
      revokeKey,
      recordUsage,
      selectKey,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [keys, theme, route, selectedKeyId, statusFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
