'use client'
import { useInvoices } from '../../components/AppStateProvider'
import { useInvoiceStats } from '../../hooks/useInvoiceStats'
import Filters from '../../components/Filters'
import InvoiceRow from '../../components/InvoiceRow'

export default function InvoicesPage() {
  const { clients, statusFilter, setStatusFilter, markPaid, removeInvoice } = useInvoices()
  const { filtered } = useInvoiceStats()

  const clientName = (id: string): string =>
    clients.find((c) => c.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-invoices">
      <h1>Invoices</h1>
      <Filters statusFilter={statusFilter} onStatusChange={setStatusFilter} />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No invoices match this filter.</p>
      ) : (
        <ul data-testid="invoice-list">
          {filtered.map((inv) => (
            <InvoiceRow
              key={inv.id}
              invoice={inv}
              clientName={clientName(inv.clientId)}
              onMarkPaid={markPaid}
              onRemove={removeInvoice}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
