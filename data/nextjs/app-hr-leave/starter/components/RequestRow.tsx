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
  // TODO: render <li data-testid="request-<id>" data-status="<status>"> with employee,
  // day, days, status spans and approve-<id>/reject-<id> buttons (disabled once decided)
  // plus an open-<id> button.
  void employeeName
  void onApprove
  void onReject
  void onOpen
  return <li data-testid={`request-${request.id}`} />
}
