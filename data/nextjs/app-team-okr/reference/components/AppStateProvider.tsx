'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Objective, Route, Theme } from '../lib/types'
import { clampProgress } from '../lib/progress'

type NewObjectiveInput = {
  title: string
  owner: string
}

type AppApi = {
  objectives: Objective[]
  theme: Theme
  route: Route
  selectedId: string | null
  addObjective: (input: NewObjectiveInput) => void
  updateProgress: (objectiveId: string, krId: string, progress: number) => void
  selectObjective: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_OBJECTIVES: Objective[] = [
  {
    id: 'o1',
    title: 'Grow revenue',
    owner: 'Ada',
    keyResults: [
      { id: 'kr1', title: 'Sign 10 deals', progress: 40 },
      { id: 'kr2', title: 'Cut churn', progress: 80 },
    ],
  },
  {
    id: 'o2',
    title: 'Improve quality',
    owner: 'Grace',
    keyResults: [{ id: 'kr3', title: 'Reduce bugs', progress: 100 }],
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [objectives, setObjectives] = useState<Objective[]>(SEED_OBJECTIVES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('objectives')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<AppApi>(() => {
    const addObjective = (input: NewObjectiveInput) => {
      const id = `o${nextId}`
      setNextId((n) => n + 1)
      setObjectives((prev) => [
        ...prev,
        { id, title: input.title, owner: input.owner, keyResults: [] },
      ])
    }

    const updateProgress = (objectiveId: string, krId: string, progress: number) => {
      const clamped = clampProgress(progress)
      setObjectives((prev) =>
        prev.map((o) =>
          o.id === objectiveId
            ? {
                ...o,
                keyResults: o.keyResults.map((kr) =>
                  kr.id === krId ? { ...kr, progress: clamped } : kr,
                ),
              }
            : o,
        ),
      )
    }

    const selectObjective = (id: string) => {
      setSelectedId(id)
      setRoute('objective-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      objectives,
      theme,
      route,
      selectedId,
      addObjective,
      updateProgress,
      selectObjective,
      setTheme,
      navigate,
    }
  }, [objectives, theme, route, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
