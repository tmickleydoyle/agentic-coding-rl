'use client'
import { useApp } from '../../components/AppStateProvider'
import RequestRow from '../../components/RequestRow'

export default function RequestsPage() {
  const { employees, requests, approveRequest, rejectRequest, selectRequest } = useApp()
  const empName = (id: string): string => employees.find((e) => e.id === id)?.name ?? 'Unknown'
  return (
    <section data-testid="page-requests">
      <h1>Requests</h1>
      <ul data-testid="request-list">
        {requests.map((r) => (
          <RequestRow
            key={r.id}
            request={r}
            employeeName={empName(r.employeeId)}
            onApprove={approveRequest}
            onReject={rejectRequest}
            onOpen={selectRequest}
          />
        ))}
      </ul>
    </section>
  )
}
