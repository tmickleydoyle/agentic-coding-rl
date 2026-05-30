'use client'
import { useApp } from '../components/AppStateProvider'
import type { Employee } from '../lib/types'

export function searchEmployees(_employees: Employee[], _query: string, _departmentFilter: string): Employee[] {
  // TODO: filter by name/title substring (case-insensitive) AND department
  return []
}

export function countByDepartment(_employees: Employee[]): { department: string; count: number }[] {
  // TODO: count employees per department, sorted by name
  return []
}

export function directReports(_employees: Employee[], _managerId: string): Employee[] {
  // TODO: employees whose managerId === managerId
  return []
}

export function useDirectory() {
  const { employees, query, departmentFilter } = useApp()
  const results = searchEmployees(employees, query, departmentFilter)
  const departments = countByDepartment(employees)
  return { results, departments }
}
