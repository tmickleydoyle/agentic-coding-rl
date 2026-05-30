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
  // TODO: render <li data-testid="lead-<id>" data-status> with name, status, propertyName
  // and an open-<id> button.
  void propertyName
  void onOpen
  return <li data-testid={`lead-${lead.id}`} />
}
