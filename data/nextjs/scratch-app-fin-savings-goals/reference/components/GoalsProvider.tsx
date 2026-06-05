'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Contribution, Goal, Route, Theme } from '../lib/types'

type NewGoalInput = {
  name: string
  target: number
  monthlyContribution: number
}

type GoalsApi = {
  goals: Goal[]
  contributions: Contribution[]
  theme: Theme
  route: Route
  selectedGoalId: string | null
  addGoal: (input: NewGoalInput) => void
  removeGoal: (id: string) => void
  contribute: (goalId: string, amount: number) => void
  selectGoal: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const GoalsContext = createContext<GoalsApi | null>(null)

const SEED_GOALS: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', target: 10000, saved: 4000, monthlyContribution: 1000 },
  { id: 'g2', name: 'Vacation', target: 3000, saved: 3000, monthlyContribution: 200 },
  { id: 'g3', name: 'New Laptop', target: 2000, saved: 500, monthlyContribution: 250 },
]

const SEED_CONTRIBUTIONS: Contribution[] = [
  { id: 'c1', goalId: 'g1', amount: 1000 },
  { id: 'c2', goalId: 'g1', amount: 3000 },
  { id: 'c3', goalId: 'g3', amount: 500 },
]

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(SEED_GOALS)
  const [contributions, setContributions] = useState<Contribution[]>(SEED_CONTRIBUTIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('goals')
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [nextGoalId, setNextGoalId] = useState(4)
  const [nextContributionId, setNextContributionId] = useState(4)

  const value = useMemo<GoalsApi>(() => {
    const addGoal = (input: NewGoalInput) => {
      const id = `g${nextGoalId}`
      setNextGoalId((n) => n + 1)
      setGoals((prev) => [
        ...prev,
        {
          id,
          name: input.name,
          target: input.target,
          saved: 0,
          monthlyContribution: input.monthlyContribution,
        },
      ])
    }

    const removeGoal = (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id))
      setContributions((prev) => prev.filter((c) => c.goalId !== id))
      setSelectedGoalId((cur) => (cur === id ? null : cur))
    }

    const contribute = (goalId: string, amount: number) => {
      const id = `c${nextContributionId}`
      setNextContributionId((n) => n + 1)
      setContributions((prev) => [...prev, { id, goalId, amount }])
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, saved: g.saved + amount } : g)),
      )
    }

    const selectGoal = (id: string) => {
      setSelectedGoalId(id)
      setRoute('goal-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      goals,
      contributions,
      theme,
      route,
      selectedGoalId,
      addGoal,
      removeGoal,
      contribute,
      selectGoal,
      setTheme,
      navigate,
    }
  }, [goals, contributions, theme, route, selectedGoalId, nextGoalId, nextContributionId])

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
}

export function useGoals(): GoalsApi {
  const v = useContext(GoalsContext)
  if (!v) throw new Error('useGoals must be used within a GoalsProvider')
  return v
}
