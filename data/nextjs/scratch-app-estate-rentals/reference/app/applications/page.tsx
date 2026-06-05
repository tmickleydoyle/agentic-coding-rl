'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ApplicationsPage() {
  const { applications, units, setAppStatus } = useApp()
  const unitLabel = (id: string): string => units.find((u) => u.id === id)?.label ?? 'Unknown'
  return (
    <section data-testid="page-applications">
      <h1>Applications</h1>
      <ul data-testid="application-list">
        {applications.map((a) => (
          <li key={a.id} data-testid={`application-${a.id}`} data-status={a.status}>
            <span data-testid={`application-${a.id}-applicant`}>{a.applicant}</span>
            <span data-testid={`application-${a.id}-unit`}>{unitLabel(a.unitId)}</span>
            <span data-testid={`application-${a.id}-status`}>{a.status}</span>
            <button data-testid={`approve-${a.id}`} onClick={() => setAppStatus(a.id, 'approved')}>
              Approve
            </button>
            <button data-testid={`reject-${a.id}`} onClick={() => setAppStatus(a.id, 'rejected')}>
              Reject
            </button>
            <button data-testid={`pending-${a.id}`} onClick={() => setAppStatus(a.id, 'pending')}>
              Pending
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
