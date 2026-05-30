'use client'
import { useApp } from '../components/AppStateProvider'
import type { Employee, LeaveRequest, LeaveStatus } from '../lib/types'

export function requestsForEmployee(_requests: LeaveRequest[], _employeeId: string): LeaveRequest[] {
  // TODO: filter requests by employeeId
  return []
}

export function usedDays(_requests: LeaveRequest[], _employeeId: string): number {
  // TODO: sum the days of the employee's approved requests
  return 0
}

export function remainingDays(_employee: Employee, _requests: LeaveRequest[]): number {
  // TODO: allowance minus used days
  return 0
}

export function countByStatus(_requests: LeaveRequest[]): Record<LeaveStatus, number> {
  // TODO: count requests per status
  return { pending: 0, approved: 0, rejected: 0 }
}

export function sortedByDay(_requests: LeaveRequest[]): LeaveRequest[] {
  // TODO: return a copy sorted ascending by day
  return []
}

export function useLeave() {
  const { requests, employees } = useApp()
  return {
    counts: countByStatus(requests),
    balances: employees.map((e) => ({
      employee: e,
      used: usedDays(requests, e.id),
      remaining: remainingDays(e, requests),
    })),
  }
}
