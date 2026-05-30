'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { QuizState, Route, Theme } from '../lib/types'

type Entry = { id: string; name: string; score: number }

type AppApi = {
  quiz: QuizState
  category: string | null
  theme: Theme
  route: Route
  lastScore: number | null
  entries: Entry[]
  choose: (choice: number) => void
  start: (category: string | null) => void
  restart: () => void
  submit: (name: string) => string | null
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  quiz: { questionIds: [], index: 0, score: 0, answers: [], done: true },
  category: null,
  theme: 'light',
  route: 'categories',
  lastScore: null,
  entries: [],
  choose: () => {},
  start: () => {},
  restart: () => {},
  submit: () => null,
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold quiz/category/theme/route/lastScore/entries in state. Implement choose
  // (answer + navigate to results on done), start, restart, submit (append to leaderboard),
  // navigate. The STUB makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
