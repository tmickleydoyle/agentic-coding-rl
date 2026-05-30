'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Poll, Route, Theme } from '../lib/types'

type AppApi = {
  polls: Poll[]
  theme: Theme
  route: Route
  selectedPollId: string | null
  vote: (pollId: string, optionId: string) => void
  createPoll: (question: string, labels: string[]) => string | null
  setTheme: (theme: Theme) => void
  openPoll: (pollId: string) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  polls: [],
  theme: 'light',
  route: 'polls',
  selectedPollId: null,
  vote: () => {},
  createPoll: () => null,
  setTheme: () => {},
  openPoll: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold polls/theme/route/selection in state (seed 3 polls), implement vote
  // (once per poll), createPoll (validated, ids q4+), openPoll/navigate, and provide them
  // through AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
