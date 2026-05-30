'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Deployment, DeployStatus, EnvFilter, Route, Theme } from '../lib/types'

type NewDeployInput = {
  env: string
  service: string
}

type AppApi = {
  deployments: Deployment[]
  theme: Theme
  route: Route
  selectedId: string | null
  envFilter: EnvFilter
  selectDeployment: (id: string) => void
  addDeployment: (input: NewDeployInput) => void
  setStatus: (id: string, status: DeployStatus) => void
  rollback: (id: string) => void
  setEnvFilter: (filter: EnvFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  deployments: [],
  theme: 'light',
  route: 'deployments',
  selectedId: null,
  envFilter: 'all',
  selectDeployment: () => {},
  addDeployment: () => {},
  setStatus: () => {},
  rollback: () => {},
  setEnvFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold deployments/theme/route/selectedId/envFilter in state (seed 3 deployments),
  // implement selectDeployment/addDeployment/setStatus/rollback/navigate, and provide them
  // through AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useDeployments(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useDeployments must be used within an AppStateProvider')
  return v
}
