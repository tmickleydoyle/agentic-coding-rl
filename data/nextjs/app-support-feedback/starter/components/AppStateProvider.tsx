'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Feedback, FeedbackStatus, Route, Sentiment, Theme } from '../lib/types'

type NewFeedbackInput = {
  author: string
  message: string
  category?: string
  sentiment?: Sentiment
}

type AppApi = {
  items: Feedback[]
  theme: Theme
  route: Route
  categoryFilter: string
  selectedId: string | null
  addFeedback: (input: NewFeedbackInput) => void
  setStatus: (id: string, status: FeedbackStatus) => void
  setCategoryFilter: (c: string) => void
  selectItem: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  items: [],
  theme: 'light',
  route: 'inbox',
  categoryFilter: 'all',
  selectedId: null,
  addFeedback: () => {},
  setStatus: () => {},
  setCategoryFilter: () => {},
  selectItem: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold items/theme/route/filter/selectedId in state (seed 4 items), implement
  // actions (selectItem navigates to item-detail, setStatus/addFeedback), provide via
  // AppContext.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
