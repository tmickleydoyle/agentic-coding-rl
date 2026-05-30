'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLeads } from '../../hooks/useLeads'
import LeadRow from '../../components/LeadRow'
import type { StatusFilter } from '../../lib/types'

const FILTERS: StatusFilter[] = ['all', 'new', 'qualified', 'converted', 'lost']

export default function LeadsPage() {
  const { statusFilter, setStatusFilter, selectLead } = useApp()
  const { visible } = useLeads()
  return (
    <section data-testid="page-leads">
      <h1>Leads</h1>
      <select
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
      >
        {FILTERS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      {visible.length === 0 ? (
        <p data-testid="empty-state">No leads.</p>
      ) : (
        <ul data-testid="lead-list">
          {visible.map((l) => (
            <LeadRow key={l.id} lead={l} onOpen={selectLead} />
          ))}
        </ul>
      )}
    </section>
  )
}
