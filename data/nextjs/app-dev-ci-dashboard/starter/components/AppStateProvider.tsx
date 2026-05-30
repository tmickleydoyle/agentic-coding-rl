'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  pipelines: [],
  builds: [],
  theme: 'light',
  route: 'pipelines',
  selectedPipelineId: null,
  statusFilter: 'all',
  retryBuild: () => {},
  setStatus: () => {},
  selectPipeline: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold pipelines/builds/theme/route/selection/filter in state (seed 3 pipelines +
  // 5 builds), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
