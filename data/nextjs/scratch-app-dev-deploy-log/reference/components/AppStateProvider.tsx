'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_DEPLOYMENTS: Deployment[] = [
  { id: 'd1', env: 'prod', service: 'api', status: 'success', createdAt: 1 },
  { id: 'd2', env: 'stage', service: 'api', status: 'failed', createdAt: 2 },
  { id: 'd3', env: 'dev', service: 'web', status: 'success', createdAt: 3 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [deployments, setDeployments] = useState<Deployment[]>(SEED_DEPLOYMENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('deployments')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [envFilter, setEnvFilter] = useState<EnvFilter>('all')
  const [nextId, setNextId] = useState(4)
  const [nextCreatedAt, setNextCreatedAt] = useState(4)

  const value = useMemo<AppApi>(() => {
    const selectDeployment = (id: string) => {
      setSelectedId(id)
      setRoute('deploy-detail')
    }

    const addDeployment = (input: NewDeployInput) => {
      const id = `d${nextId}`
      const createdAt = nextCreatedAt
      setNextId((n) => n + 1)
      setNextCreatedAt((n) => n + 1)
      setDeployments((prev) => [
        ...prev,
        { id, env: input.env, service: input.service, status: 'queued', createdAt },
      ])
    }

    const setStatus = (id: string, status: DeployStatus) => {
      setDeployments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)))
    }

    const rollback = (id: string) => {
      setDeployments((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'rolled_back' } : d)))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      deployments,
      theme,
      route,
      selectedId,
      envFilter,
      selectDeployment,
      addDeployment,
      setStatus,
      rollback,
      setEnvFilter,
      setTheme,
      navigate,
    }
  }, [deployments, theme, route, selectedId, envFilter, nextId, nextCreatedAt])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useDeployments(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useDeployments must be used within an AppStateProvider')
  return v
}
