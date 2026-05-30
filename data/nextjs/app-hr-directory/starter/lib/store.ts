import type { Employee } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `employees` + id counter; seed them; provide __reset() to re-seed.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEmployees(_filter?: { q?: string | null; department?: string | null }): Employee[] {
  // TODO: return employees, applying optional q (name/title substring) + department filters
  return []
}

export function findEmployee(_id: string): Employee | undefined {
  // TODO: look up an employee by id
  return undefined
}

export function createEmployee(_input: {
  name: string
  title: string
  department: string
  email?: string
  managerId?: string | null
}): Employee {
  // TODO: append a new employee with a fresh id and return it
  return { id: '', name: '', title: '', department: '', email: '', managerId: null }
}
