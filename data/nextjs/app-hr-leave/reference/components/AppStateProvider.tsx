'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Ada', allowance: 20 },
  { id: 'e2', name: 'Grace', allowance: 25 },
  { id: 'e3', name: 'Linus', allowance: 15 },
]

const SEED_REQUESTS: LeaveRequest[] = [
  { id: 'r1', employeeId: 'e1', day: '2026-06-01', days: 3, reason: 'Vacation', status: 'approved' },
  { id: 'r2', employeeId: 'e1', day: '2026-06-10', days: 2, reason: 'Family', status: 'pending' },
  { id: 'r3', employeeId: 'e2', day: '2026-06-05', days: 5, reason: 'Trip', status: 'pending' },
  { id: 'r4', employeeId: 'e3', day: '2026-06-08', days: 1, reason: 'Appointment', status: 'rejected' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [employees] = useState<Employee[]>(SEED_EMPLOYEES)
  const [requests, setRequests] = useState<LeaveRequest[]>(SEED_REQUESTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('requests')
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const approveRequest = (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' } : r)),
      )
    }

    const rejectRequest = (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' } : r)),
      )
    }

    const selectRequest = (requestId: string) => {
      setSelectedRequestId(requestId)
      setRoute('request-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      employees,
      requests,
      theme,
      route,
      selectedRequestId,
      approveRequest,
      rejectRequest,
      selectRequest,
      setTheme,
      navigate,
    }
  }, [employees, requests, theme, route, selectedRequestId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
