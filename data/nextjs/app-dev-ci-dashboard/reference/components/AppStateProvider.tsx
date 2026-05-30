'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type {
  Build,
  BuildStatus,
  Pipeline,
  Route,
  StatusFilter,
  Theme,
} from '../lib/types'

type AppApi = {
  pipelines: Pipeline[]
  builds: Build[]
  theme: Theme
  route: Route
  selectedPipelineId: string | null
  statusFilter: StatusFilter
  retryBuild: (id: string) => void
  setStatus: (id: string, status: BuildStatus) => void
  selectPipeline: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PIPELINES: Pipeline[] = [
  { id: 'pl1', name: 'Web App', repo: 'acme/web' },
  { id: 'pl2', name: 'API', repo: 'acme/api' },
  { id: 'pl3', name: 'Worker', repo: 'acme/worker' },
]

const SEED_BUILDS: Build[] = [
  { id: 'b1', pipelineId: 'pl1', number: 101, status: 'passing', durationSec: 120 },
  { id: 'b2', pipelineId: 'pl1', number: 102, status: 'failing', durationSec: 95 },
  { id: 'b3', pipelineId: 'pl2', number: 50, status: 'passing', durationSec: 60 },
  { id: 'b4', pipelineId: 'pl2', number: 51, status: 'running', durationSec: 0 },
  { id: 'b5', pipelineId: 'pl3', number: 12, status: 'passing', durationSec: 200 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [pipelines] = useState<Pipeline[]>(SEED_PIPELINES)
  const [builds, setBuilds] = useState<Build[]>(SEED_BUILDS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('pipelines')
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const value = useMemo<AppApi>(() => {
    const retryBuild = (id: string) => {
      setBuilds((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'running' } : b)))
    }

    const setStatus = (id: string, status: BuildStatus) => {
      setBuilds((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    }

    const selectPipeline = (id: string) => {
      setSelectedPipelineId(id)
      setRoute('pipeline-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      pipelines,
      builds,
      theme,
      route,
      selectedPipelineId,
      statusFilter,
      retryBuild,
      setStatus,
      selectPipeline,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [pipelines, builds, theme, route, selectedPipelineId, statusFilter])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
