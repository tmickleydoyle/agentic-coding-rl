import type { Employee, LeaveRequest, LeaveStatus } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let employees: Employee[] = []
let requests: LeaveRequest[] = []
let nextId = 1

function seed(): void {
  employees = [
    { id: 'e1', name: 'Ada', allowance: 20 },
    { id: 'e2', name: 'Grace', allowance: 25 },
    { id: 'e3', name: 'Linus', allowance: 15 },
  ]
  requests = [
    { id: 'r1', employeeId: 'e1', day: '2026-06-01', days: 3, reason: 'Vacation', status: 'approved' },
    { id: 'r2', employeeId: 'e1', day: '2026-06-10', days: 2, reason: 'Family', status: 'pending' },
    { id: 'r3', employeeId: 'e2', day: '2026-06-05', days: 5, reason: 'Trip', status: 'pending' },
    { id: 'r4', employeeId: 'e3', day: '2026-06-08', days: 1, reason: 'Appointment', status: 'rejected' },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listEmployees(): Employee[] {
  return employees.slice()
}

export function listRequests(filter?: { employeeId?: string | null; status?: string | null }): LeaveRequest[] {
  let out = requests.slice()
  const employeeId = filter?.employeeId
  if (employeeId) out = out.filter((r) => r.employeeId === employeeId)
  const status = filter?.status
  if (status) out = out.filter((r) => r.status === status)
  return out
}

export function findRequest(id: string): LeaveRequest | undefined {
  return requests.find((r) => r.id === id)
}

export function createRequest(input: {
  employeeId: string
  day: string
  days?: number
  reason?: string
}): LeaveRequest {
  const request: LeaveRequest = {
    id: `r${nextId++}`,
    employeeId: input.employeeId,
    day: input.day,
    days: input.days ?? 1,
    reason: input.reason ?? '',
    status: 'pending',
  }
  requests.push(request)
  return request
}

export function updateRequest(id: string, patch: { status?: LeaveStatus }): LeaveRequest | undefined {
  const request = requests.find((r) => r.id === id)
  if (!request) return undefined
  if (patch.status !== undefined) request.status = patch.status
  return request
}

export function deleteRequest(id: string): boolean {
  const idx = requests.findIndex((r) => r.id === id)
  if (idx === -1) return false
  requests.splice(idx, 1)
  return true
}

// Days already approved for an employee count against their allowance.
export function usedDays(employeeId: string): number {
  return requests
    .filter((r) => r.employeeId === employeeId && r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0)
}
