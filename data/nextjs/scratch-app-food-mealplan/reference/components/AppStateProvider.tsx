'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Assignment, Day, Recipe, Route, Theme } from '../lib/types'

type PlanApi = {
  recipes: Recipe[]
  assignments: Assignment[]
  theme: Theme
  route: Route
  selectedDay: Day
  assign: (day: Day, recipeId: string) => void
  unassign: (id: string) => void
  selectDay: (day: Day) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PlanContext = createContext<PlanApi | null>(null)

const SEED_RECIPES: Recipe[] = [
  { id: 'r1', title: 'Oatmeal', ingredients: ['oats', 'milk', 'honey'] },
  { id: 'r2', title: 'Veggie Stir Fry', ingredients: ['rice', 'broccoli', 'soy sauce', 'garlic'] },
  { id: 'r3', title: 'Caesar Salad', ingredients: ['lettuce', 'croutons', 'parmesan', 'garlic'] },
]

const SEED_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', day: 'Mon', recipeId: 'r1' },
  { id: 'a2', day: 'Mon', recipeId: 'r2' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [recipes] = useState<Recipe[]>(SEED_RECIPES)
  const [assignments, setAssignments] = useState<Assignment[]>(SEED_ASSIGNMENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('week')
  const [selectedDay, setSelectedDay] = useState<Day>('Mon')
  const [nextId, setNextId] = useState(3)

  const value = useMemo<PlanApi>(() => {
    const assign = (day: Day, recipeId: string) => {
      const id = `a${nextId}`
      setNextId((n) => n + 1)
      setAssignments((prev) => [...prev, { id, day, recipeId }])
    }

    const unassign = (id: string) => {
      setAssignments((prev) => prev.filter((a) => a.id !== id))
    }

    const selectDay = (day: Day) => {
      setSelectedDay(day)
      setRoute('day-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      recipes,
      assignments,
      theme,
      route,
      selectedDay,
      assign,
      unassign,
      selectDay,
      setTheme,
      navigate,
    }
  }, [recipes, assignments, theme, route, selectedDay, nextId])

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan(): PlanApi {
  const v = useContext(PlanContext)
  if (!v) throw new Error('usePlan must be used within an AppStateProvider')
  return v
}
