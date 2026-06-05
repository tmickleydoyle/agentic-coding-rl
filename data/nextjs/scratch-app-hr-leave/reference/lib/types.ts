export type LeaveStatus = 'pending' | 'approved' | 'rejected'

export type Employee = {
  id: string
  name: string
  allowance: number
}

export type LeaveRequest = {
  id: string
  employeeId: string
  day: string
  days: number
  reason: string
  status: LeaveStatus
}

export type Route = 'requests' | 'request-detail' | 'balances' | 'calendar'
export type Theme = 'light' | 'dark'

export const STATUSES: LeaveStatus[] = ['pending', 'approved', 'rejected']
