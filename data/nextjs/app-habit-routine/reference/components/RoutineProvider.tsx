'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Routine, RoutineKind, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type RoutineApi = {
  routines: Routine[]
  theme: Theme
  route: Route
  today: string
  toggleStep: (routineId: string, stepId: string) => void
  addRoutine: (input: { name: string; kind: RoutineKind }) => void
  addStep: (routineId: string, label: string) => void
  removeRoutine: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RoutineContext = createContext<RoutineApi | null>(null)

const SEED_ROUTINES: Routine[] = [
  {
    id: 'r1',
    name: 'Morning',
    kind: 'morning',
    history: ['2026-05-26', '2026-05-27'],
    steps: [
      { id: 'r1-s1', label: 'Stretch', done: true },
      { id: 'r1-s2', label: 'Water', done: true },
      { id: 'r1-s3', label: 'Plan day', done: false },
    ],
  },
  {
    id: 'r2',
    name: 'Evening',
    kind: 'evening',
    history: ['2026-05-27'],
    steps: [
      { id: 'r2-s1', label: 'Journal', done: true },
      { id: 'r2-s2', label: 'Read', done: true },
    ],
  },
]

function applyCompletion(r: Routine, today: string): Routine {
  const complete = r.steps.length > 0 && r.steps.every((s) => s.done)
  let history = r.history
  if (complete) {
    if (!history.includes(today)) history = [...history, today].sort()
  } else {
    history = history.filter((d) => d !== today)
  }
  return { ...r, history }
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, setRoutines] = useState<Routine[]>(SEED_ROUTINES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [today] = useState(TODAY)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<RoutineApi>(() => {
    const toggleStep = (routineId: string, stepId: string) => {
      setRoutines((prev) =>
        prev.map((r) => {
          if (r.id !== routineId) return r
          const steps = r.steps.map((s) =>
            s.id === stepId ? { ...s, done: !s.done } : s,
          )
          return applyCompletion({ ...r, steps }, today)
        }),
      )
    }

    const addRoutine = (input: { name: string; kind: RoutineKind }) => {
      const name = input.name.trim()
      if (name.length === 0) return
      const id = `r${nextId}`
      setNextId((n) => n + 1)
      setRoutines((prev) => [
        ...prev,
        { id, name, kind: input.kind, steps: [], history: [] },
      ])
    }

    const addStep = (routineId: string, label: string) => {
      const trimmed = label.trim()
      if (trimmed.length === 0) return
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === routineId
            ? {
                ...r,
                steps: [
                  ...r.steps,
                  { id: `${r.id}-s${r.steps.length + 1}`, label: trimmed, done: false },
                ],
              }
            : r,
        ),
      )
    }

    const removeRoutine = (id: string) => {
      setRoutines((prev) => prev.filter((r) => r.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      routines,
      theme,
      route,
      today,
      toggleStep,
      addRoutine,
      addStep,
      removeRoutine,
      setTheme,
      navigate,
    }
  }, [routines, theme, route, today, nextId])

  return <RoutineContext.Provider value={value}>{children}</RoutineContext.Provider>
}

export function useRoutine(): RoutineApi {
  const v = useContext(RoutineContext)
  if (!v) throw new Error('useRoutine must be used within a RoutineProvider')
  return v
}
