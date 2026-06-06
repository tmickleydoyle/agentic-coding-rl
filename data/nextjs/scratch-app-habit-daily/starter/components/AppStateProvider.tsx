'use client'
import React, { createContext, useContext, useState } from 'react'
import { Habit, HabitLog, Route } from '../lib/types'
import { TODAY } from '../lib/store'

interface AppState {
  route: Route; habits: Habit[]; logs: HabitLog[]; today: string;
  navigate: (r: Route) => void; setHabits: (h: Habit[]) => void; setLogs: (l: HabitLog[]) => void;
}
const AppContext = createContext<AppState>({ route: 'home', habits: [], logs: [], today: TODAY, navigate: () => {}, setHabits: () => {}, setLogs: () => {} })
export function useApp() { return useContext(AppContext) }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route] = useState<Route>('home')
  return <AppContext.Provider value={{ route, habits: [], logs: [], today: TODAY, navigate: () => {}, setHabits: () => {}, setLogs: () => {} }}>{children}</AppContext.Provider>
}
