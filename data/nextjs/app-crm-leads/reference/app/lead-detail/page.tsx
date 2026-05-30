'use client'
import { useApp } from '../../components/AppStateProvider'

export default function LeadDetailPage() {
  const { leads, deals, selectedLeadId, qualifyLead, loseLead, convertLead } = useApp()
  const lead = leads.find((l) => l.id === selectedLeadId)

  if (!lead) {
    return (
      <section data-testid="page-lead-detail">
        <p data-testid="no-lead">No lead selected.</p>
      </section>
    )
  }

  const deal = deals.find((d) => d.leadId === lead.id)

  return (
    <section data-testid="page-lead-detail">
      <h1 data-testid="detail-name">{lead.name}</h1>
      <p data-testid="detail-source">{lead.source}</p>
      <p data-testid="detail-score">{lead.score}</p>
      <p data-testid="detail-status">{lead.status}</p>
      <button
        data-testid="detail-qualify"
        disabled={lead.status !== 'new'}
        onClick={() => qualifyLead(lead.id)}
      >
        Qualify
      </button>
      <button
        data-testid="detail-convert"
        disabled={lead.status === 'converted' || lead.status === 'lost'}
        onClick={() => convertLead(lead.id, lead.score * 100)}
      >
        Convert
      </button>
      <button
        data-testid="detail-lose"
        disabled={lead.status === 'converted' || lead.status === 'lost'}
        onClick={() => loseLead(lead.id)}
      >
        Lose
      </button>
      {deal && <p data-testid="detail-deal-value">{deal.value}</p>}
    </section>
  )
}
