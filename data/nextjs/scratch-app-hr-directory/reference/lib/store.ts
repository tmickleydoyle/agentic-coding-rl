import type { Employee } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach for isolation.

let employees: Employee[] = []
let nextId = 1

function seed(): void {
  employees = [
    { id: 'e1', name: 'Ada Lovelace', title: 'CEO', department: 'Executive', email: 'ada@co.com', managerId: null },
    { id: 'e2', name: 'Alan Turing', title: 'VP Engineering', department: 'Engineering', email: 'alan@co.com', managerId: 'e1' },
    { id: 'e3', name: 'Grace Hopper', title: 'Engineer', department: 'Engineering', email: 'grace@co.com', managerId: 'e2' },
    { id: 'e4', name: 'Katherine Johnson', title: 'Sales Lead', department: 'Sales', email: 'kat@co.com', managerId: 'e1' },
    { id: 'e5', name: 'Mary Jackson', title: 'Sales Rep', department: 'Sales', email: 'mary@co.com', managerId: 'e4' },
  ]
  nextId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listEmployees(filter?: { q?: string | null; department?: string | null }): Employee[] {
  let out = employees.slice()
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.trim().toLowerCase()
    out = out.filter(
      (e) =>
        e.name.toLowerCase().includes(needle) ||
        e.title.toLowerCase().includes(needle),
    )
  }
  const department = filter?.department
  if (department) out = out.filter((e) => e.department === department)
  return out
}

export function findEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id === id)
}

export function createEmployee(input: {
  name: string
  title: string
  department: string
  email?: string
  managerId?: string | null
}): Employee {
  const employee: Employee = {
    id: `e${nextId++}`,
    name: input.name,
    title: input.title,
    department: input.department,
    email: input.email ?? '',
    managerId: input.managerId ?? null,
  }
  employees.push(employee)
  return employee
}
