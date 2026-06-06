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
  const [route, setRoute] = useState<Route>('home')
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'g1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, deadline: '2026-12-31', category: 'Savings' },
    { id: 'g2', name: 'Vacation', targetAmount: 3000, currentAmount: 3200, deadline: '2026-06-30', category: 'Travel' },
    { id: 'g3', name: 'New Laptop', targetAmount: 2000, currentAmount: 800, deadline: '2025-09-01', category: 'Tech' },
  ])
  const [budgetEntries, setBudgetEntries] = useState<BudgetEntry[]>([
    { id: 'b1', category: 'Rent', amount: 1500, month: '2026-06' },
    { id: 'b2', category: 'Food', amount: 400, month: '2026-06' },
  ])

  const navigate = (r: Route) => setRoute(r)

  return (
    <AppContext.Provider value={{ route, goals, budgetEntries, navigate, setGoals, setBudgetEntries }}>
      {children}
    </AppContext.Provider>
  )
}
