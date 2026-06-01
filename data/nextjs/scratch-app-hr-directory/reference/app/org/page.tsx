'use client'
import { useApp } from '../../components/AppStateProvider'
import { directReports } from '../../hooks/useDirectory'
import type { Employee } from '../../lib/types'

function Node({
  employee,
  employees,
  onOpen,
}: {
  employee: Employee
  employees: Employee[]
  onOpen: (id: string) => void
}) {
  const reports = directReports(employees, employee.id)
  return (
    <li data-testid={`org-${employee.id}`}>
      <button data-testid={`org-open-${employee.id}`} onClick={() => onOpen(employee.id)}>
        {employee.name}
      </button>
      {reports.length > 0 ? (
        <ul data-testid={`org-children-${employee.id}`}>
          {reports.map((r) => (
            <Node key={r.id} employee={r} employees={employees} onOpen={onOpen} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default function OrgPage() {
  const { employees, selectEmployee } = useApp()
  const roots = employees.filter((e) => e.managerId === null)
  return (
    <section data-testid="page-org">
      <h1>Org chart</h1>
      <ul data-testid="org-tree">
        {roots.map((r) => (
          <Node key={r.id} employee={r} employees={employees} onOpen={selectEmployee} />
        ))}
      </ul>
    </section>
  )
}
