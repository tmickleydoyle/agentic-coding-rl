'use client'
import type { Employee } from '../lib/types'

export default function EmployeeCard({
  employee,
  onOpen,
}: {
  employee: Employee
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`emp-${employee.id}`}>
      <span data-testid={`emp-${employee.id}-name`}>{employee.name}</span>
      <span data-testid={`emp-${employee.id}-title`}>{employee.title}</span>
      <span data-testid={`emp-${employee.id}-dept`}>{employee.department}</span>
      <button data-testid={`open-${employee.id}`} onClick={() => onOpen(employee.id)}>
        View
      </button>
    </li>
  )
}
