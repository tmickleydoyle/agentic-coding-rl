'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Candidate, Job, Route, Stage, Theme } from '../lib/types'
import { STAGES } from '../lib/types'

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

const SEED_JOBS: Job[] = [
  { id: 'j1', title: 'Frontend Engineer', department: 'Engineering' },
  { id: 'j2', title: 'Product Designer', department: 'Design' },
  { id: 'j3', title: 'Recruiter', department: 'People' },
]

const SEED_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Ada Lovelace', jobId: 'j1', stage: 'interview' },
  { id: 'c2', name: 'Grace Hopper', jobId: 'j1', stage: 'applied' },
  { id: 'c3', name: 'Linus Torvalds', jobId: 'j2', stage: 'offer' },
  { id: 'c4', name: 'Margaret Hamilton', jobId: 'j1', stage: 'hired' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [jobs] = useState<Job[]>(SEED_JOBS)
  const [candidates, setCandidates] = useState<Candidate[]>(SEED_CANDIDATES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('jobs')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const addCandidate = (input: NewCandidateInput) => {
      const id = `c${nextId}`
      setNextId((n) => n + 1)
      setCandidates((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          jobId: input.jobId,
          stage: input.stage ?? 'applied',
        },
      ])
    }

    const moveStage = (candidateId: string, stage: Stage) => {
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, stage } : c)))
    }

    const advanceStage = (candidateId: string) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const idx = STAGES.indexOf(c.stage)
          const next = idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1] : c.stage
          return { ...c, stage: next }
        }),
      )
    }

    const selectJob = (jobId: string) => {
      setSelectedJobId(jobId)
      setRoute('job-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      jobs,
      candidates,
      theme,
      route,
      selectedJobId,
      addCandidate,
      moveStage,
      advanceStage,
      selectJob,
      setTheme,
      navigate,
    }
  }, [jobs, candidates, theme, route, selectedJobId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
