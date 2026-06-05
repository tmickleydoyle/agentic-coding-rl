'use client'
import { useApp } from '../components/AppStateProvider'
import type { Employee } from '../lib/types'

export function searchEmployees(employees: Employee[], query: string, departmentFilter: string): Employee[] {
  const needle = query.trim().toLowerCase()
  return employees.filter((e) => {
    if (departmentFilter !== 'all' && e.department !== departmentFilter) return false
    if (needle.length > 0) {
      if (!e.name.toLowerCase().includes(needle) && !e.title.toLowerCase().includes(needle)) return false
    }
    return true
  })
}

export function countByDepartment(employees: Employee[]): { department: string; count: number }[] {
  const map: Record<string, number> = {}
  employees.forEach((e) => {
    map[e.department] = (map[e.department] ?? 0) + 1
  })
  const names = Object.keys(map).sort()
  return names.map((department) => ({ department, count: map[department] }))
}

export function directReports(employees: Employee[], managerId: string): Employee[] {
  return employees.filter((e) => e.managerId === managerId)
}

export function useDirectory() {
  const { employees, query, departmentFilter } = useApp()
  const results = searchEmployees(employees, query, departmentFilter)
  const departments = countByDepartment(employees)
  return { results, departments }
}
