'use client'
import React, { createContext, useContext, useState } from 'react'
import { Habit, Completion, Route } from '../lib/types'
import { TODAY } from '../lib/store'
interface AppState { route: Route; habits: Habit[]; completions: Completion[]; today: string; navigate: (r: Route) => void; setHabits: (h: Habit[]) => void; setCompletions: (c: Completion[]) => void; getStreak: (id: string) => number }
const AppContext = createContext<AppState>({ route: 'home', habits: [], completions: [], today: TODAY, navigate: () => {}, setHabits: () => {}, setCompletions: () => {}, getStreak: () => 0 })
export function useApp() { return useContext(AppContext) }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  return <AppContext.Provider value={{ route, habits: [], completions: [], today: TODAY, navigate: () => {}, setHabits: () => {}, setCompletions: () => {}, getStreak: () => 0 }}>{children}</AppContext.Provider>
}
