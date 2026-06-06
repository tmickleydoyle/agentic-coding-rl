'use client'
import React, { createContext, useContext, useState } from 'react'
import { Goal, BudgetEntry, Route } from '../lib/types'

interface AppState {
  route: Route
  goals: Goal[]
  budgetEntries: BudgetEntry[]
  navigate: (r: Route) => void
  setGoals: (g: Goal[]) => void
  setBudgetEntries: (b: BudgetEntry[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home',
  goals: [],
  budgetEntries: [],
  navigate: () => {},
  setGoals: () => {},
  setBudgetEntries: () => {},
})

export function useApp() {
  return useContext(AppContext)
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  const [goals] = useState<Goal[]>([])
  const [budgetEntries] = useState<BudgetEntry[]>([])

  return (
    <AppContext.Provider value={{ route, goals, budgetEntries, navigate: () => {}, setGoals: () => {}, setBudgetEntries: () => {} }}>
      {children}
    </AppContext.Provider>
  )
}
