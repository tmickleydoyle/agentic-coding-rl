'use client'
import type { LeaveRequest } from '../lib/types'

export default function RequestRow({
  request,
  employeeName,
  onApprove,
  onReject,
  onOpen,
}: {
  request: LeaveRequest
  employeeName: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onOpen: (id: string) => void
}) {
  const decided = request.status !== 'pending'
  return (
    <li data-testid={`request-${request.id}`} data-status={request.status}>
      <span data-testid={`request-${request.id}-employee`}>{employeeName}</span>
      <span data-testid={`request-${request.id}-day`}>{request.day}</span>
      <span data-testid={`request-${request.id}-days`}>{request.days}</span>
      <span data-testid={`request-${request.id}-status`}>{request.status}</span>
      <button data-testid={`approve-${request.id}`} disabled={decided} onClick={() => onApprove(request.id)}>
        Approve
      </button>
      <button data-testid={`reject-${request.id}`} disabled={decided} onClick={() => onReject(request.id)}>
        Reject
      </button>
      <button data-testid={`open-${request.id}`} onClick={() => onOpen(request.id)}>
        Open
      </button>
    </li>
  )
}
