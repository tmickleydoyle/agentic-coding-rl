'use client'
import { useCrm } from '../../components/AppStateProvider'
import { usePipeline } from '../../hooks/usePipeline'
import LeadRow from '../../components/LeadRow'
import StatusFilter from '../../components/StatusFilter'

export default function LeadsPage() {
  const { properties, statusFilter, setStatusFilter, openLead } = useCrm()
  const { filtered } = usePipeline()

  const propertyName = (id: string | null): string =>
    id == null ? 'Unassigned' : properties.find((p) => p.id === id)?.address ?? 'Unknown'

  return (
    <section data-testid="page-leads">
      <h1>Leads</h1>
      <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      <p data-testid="lead-count">{filtered.length}</p>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No leads match this filter.</p>
      ) : (
        <ul data-testid="lead-list">
          {filtered.map((l) => (
            <LeadRow
              key={l.id}
              lead={l}
              propertyName={propertyName(l.propertyId)}
              onOpen={openLead}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
