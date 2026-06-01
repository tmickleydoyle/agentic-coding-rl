'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_ISSUES: Issue[] = [
  { id: 'i1', title: 'Login button broken', labels: ['bug', 'ui'], priority: 'high', assignee: 'alice', status: 'open' },
  { id: 'i2', title: 'Slow dashboard query', labels: ['bug', 'perf'], priority: 'medium', assignee: null, status: 'in-progress' },
  { id: 'i3', title: 'Add dark mode', labels: ['feature', 'ui'], priority: 'low', assignee: 'bob', status: 'open' },
  { id: 'i4', title: 'Typo in footer', labels: ['ui'], priority: 'low', assignee: null, status: 'closed' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(SEED_ISSUES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('issues')
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [labelFilter, setLabelFilter] = useState<LabelFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('all')

  const value = useMemo<AppApi>(() => {
    const assign = (id: string, assignee: string | null) => {
      setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, assignee } : i)))
    }
    const setPriority = (id: string, priority: Priority) => {
      setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, priority } : i)))
    }
    const setStatus = (id: string, status: IssueStatus) => {
      setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    }
    const selectIssue = (id: string) => {
      setSelectedIssueId(id)
      setRoute('issue-detail')
    }
    const navigate = (next: Route) => setRoute(next)

    return {
      issues,
      theme,
      route,
      selectedIssueId,
      labelFilter,
      priorityFilter,
      assigneeFilter,
      assign,
      setPriority,
      setStatus,
      selectIssue,
      setLabelFilter,
      setPriorityFilter,
      setAssigneeFilter,
      setTheme,
      navigate,
    }
  }, [issues, theme, route, selectedIssueId, labelFilter, priorityFilter, assigneeFilter])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
