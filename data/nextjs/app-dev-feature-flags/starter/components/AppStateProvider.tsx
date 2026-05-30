'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { AuditEntry, Env, Flag, Route, Theme } from '../lib/types'

type NewFlagInput = {
  key: string
  description?: string
}

type AppApi = {
  flags: Flag[]
  audit: AuditEntry[]
  theme: Theme
  route: Route
  selectedId: string | null
  selectFlag: (id: string) => void
  toggleEnv: (id: string, env: Env) => void
  setRollout: (id: string, pct: number) => void
  addFlag: (input: NewFlagInput) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  flags: [],
  audit: [],
  theme: 'light',
  route: 'flags',
  selectedId: null,
  selectFlag: () => {},
  toggleEnv: () => {},
  setRollout: () => {},
  addFlag: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold flags/audit/theme/route/selectedId in state (seed 3 flags, empty audit),
  // implement selectFlag/toggleEnv/setRollout/addFlag (each toggle/rollout/create appends an
  // audit entry) and navigate, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useFlags(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useFlags must be used within an AppStateProvider')
  return v
}
