'use client'
import { useInvoices } from '../../components/AppStateProvider'
import { outstandingForClient } from '../../hooks/useInvoiceStats'

export default function ClientsPage() {
  const { clients, invoices } = useInvoices()
  return (
    <section data-testid="page-clients">
      <h1>Clients</h1>
      <ul data-testid="client-list">
        {clients.map((c) => (
          <li key={c.id} data-testid={`client-${c.id}`}>
            <span data-testid={`client-${c.id}-name`}>{c.name}</span>
            <span data-testid={`client-${c.id}-email`}>{c.email}</span>
            <span data-testid={`client-${c.id}-outstanding`}>
              {outstandingForClient(invoices, c.id)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
