'use client'
import { useApp } from '../../components/AppStateProvider'
import { directReports } from '../../hooks/useDirectory'

export default function ProfilePage() {
  const { employees, selectedId, selectEmployee } = useApp()
  const employee = employees.find((e) => e.id === selectedId) ?? null
  if (!employee) {
    return (
      <section data-testid="page-profile">
        <p data-testid="no-selection">No employee selected.</p>
      </section>
    )
  }
  const manager = employees.find((e) => e.id === employee.managerId) ?? null
  const reports = directReports(employees, employee.id)
  return (
    <section data-testid="page-profile">
      <h1 data-testid="profile-name">{employee.name}</h1>
      <p data-testid="profile-title">{employee.title}</p>
      <p data-testid="profile-dept">{employee.department}</p>
      <p data-testid="profile-email">{employee.email}</p>
      <p data-testid="profile-manager">{manager ? manager.name : 'None'}</p>
      <ul data-testid="profile-reports">
        {reports.map((r) => (
          <li key={r.id} data-testid={`report-${r.id}`}>
            <button data-testid={`open-report-${r.id}`} onClick={() => selectEmployee(r.id)}>
              {r.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
