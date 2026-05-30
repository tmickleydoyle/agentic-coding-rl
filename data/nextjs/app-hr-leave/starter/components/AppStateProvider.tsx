'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Employee, LeaveRequest, Route, Theme } from '../lib/types'

type AppApi = {
  employees: Employee[]
  requests: LeaveRequest[]
  theme: Theme
  route: Route
  selectedRequestId: string | null
  approveRequest: (requestId: string) => void
  rejectRequest: (requestId: string) => void
  selectRequest: (requestId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  employees: [],
  requests: [],
  theme: 'light',
  route: 'requests',
  selectedRequestId: null,
  approveRequest: () => {},
  rejectRequest: () => {},
  selectRequest: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold employees/requests/theme/route/selectedRequestId in state (seed 3
  // employees + 4 requests), implement approve/reject/select/navigate, and provide them
  // through AppContext. The STUB below makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
