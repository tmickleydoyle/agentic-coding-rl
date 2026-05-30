'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Candidate, Job, Route, Stage, Theme } from '../lib/types'

type NewCandidateInput = {
  name: string
  jobId: string
  stage?: Stage
}

type AppApi = {
  jobs: Job[]
  candidates: Candidate[]
  theme: Theme
  route: Route
  selectedJobId: string | null
  addCandidate: (input: NewCandidateInput) => void
  moveStage: (candidateId: string, stage: Stage) => void
  advanceStage: (candidateId: string) => void
  selectJob: (jobId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  jobs: [],
  candidates: [],
  theme: 'light',
  route: 'jobs',
  selectedJobId: null,
  addCandidate: () => {},
  moveStage: () => {},
  advanceStage: () => {},
  selectJob: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold jobs/candidates/theme/route/selectedJobId in state (seed 3 jobs + 4
  // candidates), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
