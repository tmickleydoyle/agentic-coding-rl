'use client'
import { useApp } from '../../components/AppStateProvider'

export default function RequestDetailPage() {
  const { employees, requests, selectedRequestId, approveRequest, rejectRequest } = useApp()
  const request = requests.find((r) => r.id === selectedRequestId)

  if (!request) {
    return (
      <section data-testid="page-request-detail">
        <p data-testid="no-request">No request selected.</p>
      </section>
    )
  }

  const employee = employees.find((e) => e.id === request.employeeId)
  const decided = request.status !== 'pending'

  return (
    <section data-testid="page-request-detail">
      <h1 data-testid="detail-employee">{employee?.name ?? 'Unknown'}</h1>
      <span data-testid="detail-day">{request.day}</span>
      <span data-testid="detail-days">{request.days}</span>
      <span data-testid="detail-reason">{request.reason}</span>
      <span data-testid="detail-status">{request.status}</span>
      <button data-testid="detail-approve" disabled={decided} onClick={() => approveRequest(request.id)}>
        Approve
      </button>
      <button data-testid="detail-reject" disabled={decided} onClick={() => rejectRequest(request.id)}>
        Reject
      </button>
    </section>
  )
}
