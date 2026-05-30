'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type {
  AssigneeFilter,
  Issue,
  IssueStatus,
  LabelFilter,
  Priority,
  PriorityFilter,
  Route,
  Theme,
} from '../lib/types'

type AppApi = {
  issues: Issue[]
  theme: Theme
  route: Route
  selectedIssueId: string | null
  labelFilter: LabelFilter
  priorityFilter: PriorityFilter
  assigneeFilter: AssigneeFilter
  assign: (id: string, assignee: string | null) => void
  setPriority: (id: string, priority: Priority) => void
  setStatus: (id: string, status: IssueStatus) => void
  selectIssue: (id: string) => void
  setLabelFilter: (filter: LabelFilter) => void
  setPriorityFilter: (filter: PriorityFilter) => void
  setAssigneeFilter: (filter: AssigneeFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  issues: [],
  theme: 'light',
  route: 'issues',
  selectedIssueId: null,
  labelFilter: 'all',
  priorityFilter: 'all',
  assigneeFilter: 'all',
  assign: () => {},
  setPriority: () => {},
  setStatus: () => {},
  selectIssue: () => {},
  setLabelFilter: () => {},
  setPriorityFilter: () => {},
  setAssigneeFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold issues/theme/route/selection/filters in state (seed 4 issues), implement the
  // actions, and provide them through AppContext. The STUB below makes the app mount but
  // does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
