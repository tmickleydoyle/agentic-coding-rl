'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Goal, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type GoalApi = {
  goals: Goal[]
  theme: Theme
  route: Route
  today: string
  selectedId: string | null
  selectGoal: (id: string) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
  addGoal: (input: { name: string; targetDate: string }) => void
  removeGoal: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const GoalContext = createContext<GoalApi | null>(null)

const SEED_GOALS: Goal[] = [
  {
    id: 'g1',
    name: 'Run a 5K',
    targetDate: '2026-06-30',
    milestones: [
      { id: 'g1-m1', title: 'Buy shoes', done: true },
      { id: 'g1-m2', title: 'Run 1K', done: true },
      { id: 'g1-m3', title: 'Run 3K', done: false },
      { id: 'g1-m4', title: 'Run 5K', done: false },
    ],
  },
  {
    id: 'g2',
    name: 'Read 12 books',
    targetDate: '2026-12-31',
    milestones: [
      { id: 'g2-m1', title: 'Pick list', done: true },
      { id: 'g2-m2', title: 'Read 6', done: true },
      { id: 'g2-m3', title: 'Read 12', done: true },
    ],
  },
]

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(SEED_GOALS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('goals')
  const [today] = useState(TODAY)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(3)

  const value = useMemo<GoalApi>(() => {
    const selectGoal = (id: string) => {
      setSelectedId(id)
      setRoute('goal-detail')
    }

    const toggleMilestone = (goalId: string, milestoneId: string) => {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? {
                ...g,
                milestones: g.milestones.map((m) =>
                  m.id === milestoneId ? { ...m, done: !m.done } : m,
                ),
              }
            : g,
        ),
      )
    }

    const addGoal = (input: { name: string; targetDate: string }) => {
      const name = input.name.trim()
      const targetDate = input.targetDate.trim()
      if (name.length === 0 || targetDate.length === 0) return
      const id = `g${nextId}`
      setNextId((n) => n + 1)
      setGoals((prev) => [
        ...prev,
        {
          id,
          name,
          targetDate,
          milestones: [{ id: `${id}-m1`, title: 'Get started', done: false }],
        },
      ])
    }

    const removeGoal = (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id))
      setSelectedId((cur) => (cur === id ? null : cur))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      goals,
      theme,
      route,
      today,
      selectedId,
      selectGoal,
      toggleMilestone,
      addGoal,
      removeGoal,
      setTheme,
      navigate,
    }
  }, [goals, theme, route, today, selectedId, nextId])

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>
}

export function useGoals(): GoalApi {
  const v = useContext(GoalContext)
  if (!v) throw new Error('useGoals must be used within a GoalProvider')
  return v
}
