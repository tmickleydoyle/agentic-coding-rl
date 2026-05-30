'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  keys: [],
  theme: 'light',
  route: 'keys',
  selectedKeyId: null,
  statusFilter: 'all',
  createKey: () => {},
  revokeKey: () => {},
  recordUsage: () => {},
  selectKey: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold keys/theme/route/selection/filter in state (seed 3 keys), implement the
  // actions (createKey/revokeKey/recordUsage/selectKey), and provide them through
  // AppContext. The STUB below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
