'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { HistoryEntry, Route, Schedule, Task, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type NewTaskInput = { title: string; schedule: Schedule }

type RecurringApi = {
  tasks: Task[]
  history: HistoryEntry[]
  theme: Theme
  route: Route
  today: string
  addTask: (input: NewTaskInput) => void
  completeTask: (id: string) => void
  removeTask: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const RecurringContext = createContext<RecurringApi | null>(null)

const STUB: RecurringApi = {
  tasks: [],
  history: [],
  theme: 'light',
  route: 'today',
  today: TODAY,
  addTask: () => {},
  completeTask: () => {},
  removeTask: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function RecurringProvider({ children }: { children: ReactNode }) {
  // TODO: hold tasks/history/theme/route in state (seed 3 tasks + 1 history entry),
  // implement addTask/completeTask (records history + advances nextDue)/removeTask, and
  // provide them through RecurringContext. The STUB below makes the app mount but does
  // nothing — replace it with real state + actions.
  return <RecurringContext.Provider value={STUB}>{children}</RecurringContext.Provider>
}

export function useRecurring(): RecurringApi {
  const v = useContext(RecurringContext)
  if (!v) throw new Error('useRecurring must be used within a RecurringProvider')
  return v
}
