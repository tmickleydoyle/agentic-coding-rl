'use client'
import { useApp } from '../../components/AppStateProvider'
import { STAGES } from '../../hooks/usePipeline'
import type { Stage } from '../../lib/types'

const LABELS: Record<Stage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
}

export default function DealDetailPage() {
  const { deals, contacts, selectedDealId, moveStage } = useApp()
  const deal = deals.find((d) => d.id === selectedDealId)

  if (!deal) {
    return (
      <section data-testid="page-deal-detail">
        <p data-testid="no-deal">No deal selected.</p>
      </section>
    )
  }

  const contact = contacts.find((c) => c.id === deal.contactId)

  return (
    <section data-testid="page-deal-detail">
      <h1 data-testid="detail-title">{deal.title}</h1>
      <p data-testid="detail-value">{deal.value}</p>
      <p data-testid="detail-stage">{deal.stage}</p>
      <p data-testid="detail-contact">{contact ? contact.name : 'Unknown'}</p>
      <select
        data-testid="detail-stage-select"
        value={deal.stage}
        onChange={(e) => moveStage(deal.id, e.target.value as Stage)}
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {LABELS[s]}
          </option>
        ))}
      </select>
    </section>
  )
}
