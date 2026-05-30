import type { Employee, LeaveRequest, LeaveStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level employees/requests and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEmployees(): Employee[] {
  // TODO: return all employees
  return []
}

export function listRequests(_filter?: { employeeId?: string | null; status?: string | null }): LeaveRequest[] {
  // TODO: return requests, applying optional employeeId + status filters
  return []
}

export function findRequest(_id: string): LeaveRequest | undefined {
  // TODO: look up a request by id
  return undefined
}

export function createRequest(_input: {
  employeeId: string
  day: string
  days?: number
  reason?: string
}): LeaveRequest {
  // TODO: append a new request (status 'pending', default days 1) and return it
  return { id: '', employeeId: '', day: '', days: 1, reason: '', status: 'pending' }
}

export function updateRequest(_id: string, _patch: { status?: LeaveStatus }): LeaveRequest | undefined {
  // TODO: apply the status patch and return the updated request, or undefined if absent
  return undefined
}

export function deleteRequest(_id: string): boolean {
  // TODO: remove the request; return whether it existed
  return false
}

export function usedDays(_employeeId: string): number {
  // TODO: sum the days of the employee's approved requests
  return 0
}
