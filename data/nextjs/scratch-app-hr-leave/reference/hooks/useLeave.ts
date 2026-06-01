'use client'
import { useApp } from '../components/AppStateProvider'
import type { Employee, LeaveRequest, LeaveStatus } from '../lib/types'

export function requestsForEmployee(requests: LeaveRequest[], employeeId: string): LeaveRequest[] {
  return requests.filter((r) => r.employeeId === employeeId)
}

export function usedDays(requests: LeaveRequest[], employeeId: string): number {
  return requests
    .filter((r) => r.employeeId === employeeId && r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0)
}

export function remainingDays(employee: Employee, requests: LeaveRequest[]): number {
  return employee.allowance - usedDays(requests, employee.id)
}

export function countByStatus(requests: LeaveRequest[]): Record<LeaveStatus, number> {
  const counts: Record<LeaveStatus, number> = { pending: 0, approved: 0, rejected: 0 }
  requests.forEach((r) => {
    counts[r.status] = (counts[r.status] ?? 0) + 1
  })
  return counts
}

export function sortedByDay(requests: LeaveRequest[]): LeaveRequest[] {
  return requests.slice().sort((a, b) => a.day.localeCompare(b.day))
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
