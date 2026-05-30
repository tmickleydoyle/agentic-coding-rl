'use client'
import type { Lead } from '../lib/types'

export default function LeadRow({
  lead,
  onOpen,
}: {
  lead: Lead
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`lead-${lead.id}`} data-status={lead.status}>
      <span data-testid={`lead-${lead.id}-name`}>{lead.name}</span>
      <span data-testid={`lead-${lead.id}-score`}>{lead.score}</span>
      <span data-testid={`lead-${lead.id}-status`}>{lead.status}</span>
      <button data-testid={`open-${lead.id}`} onClick={() => onOpen(lead.id)}>
        Open
      </button>
    </li>
  )
}
