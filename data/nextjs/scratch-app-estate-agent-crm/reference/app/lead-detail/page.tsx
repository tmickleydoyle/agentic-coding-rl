'use client'
import { useCrm } from '../../components/AppStateProvider'
import { STATUS_ORDER, type LeadStatus } from '../../lib/types'

export default function LeadDetailPage() {
  const { leads, properties, selectedId, setStatus, assignProperty, navigate } = useCrm()
  const lead = leads.find((l) => l.id === selectedId)

  if (!lead) {
    return (
      <section data-testid="page-lead-detail">
        <p data-testid="detail-empty">No lead selected.</p>
      </section>
    )
  }

  const propertyName =
    lead.propertyId == null
      ? 'Unassigned'
      : properties.find((p) => p.id === lead.propertyId)?.address ?? 'Unknown'

  return (
    <section data-testid="page-lead-detail">
      <h1 data-testid="detail-name">{lead.name}</h1>
      <p data-testid="detail-status">{lead.status}</p>
      <p data-testid="detail-property">{propertyName}</p>

      <label htmlFor="status-select">Status</label>
      <select
        id="status-select"
        data-testid="status-select"
        value={lead.status}
        onChange={(e) => setStatus(lead.id, e.target.value as LeadStatus)}
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label htmlFor="assign-select">Property</label>
      <select
        id="assign-select"
        data-testid="assign-select"
        value={lead.propertyId ?? ''}
        onChange={(e) => assignProperty(lead.id, e.target.value === '' ? null : e.target.value)}
      >
        <option value="">Unassigned</option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.address}
          </option>
        ))}
      </select>

      <button data-testid="detail-back" onClick={() => navigate('leads')}>
        Back
      </button>
    </section>
  )
}
