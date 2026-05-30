'use client'
import type { Lead } from '../lib/types'

export default function LeadRow({
  lead,
  propertyName,
  onOpen,
}: {
  lead: Lead
  propertyName: string
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`lead-${lead.id}`} data-status={lead.status}>
      <span data-testid={`lead-${lead.id}-name`}>{lead.name}</span>
      <span data-testid={`lead-${lead.id}-status`}>{lead.status}</span>
      <span data-testid={`lead-${lead.id}-property`}>{propertyName}</span>
      <button data-testid={`open-${lead.id}`} onClick={() => onOpen(lead.id)}>
        Open
      </button>
    </li>
  )
}
