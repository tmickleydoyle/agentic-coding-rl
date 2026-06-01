'use client'
import { useApp } from '../../components/AppStateProvider'
import { useQuotes } from '../../hooks/useQuotes'

export default function AcceptedPage() {
  const { quotes } = useApp()
  const { total, acceptedTotal } = useQuotes()
  const accepted = quotes.filter((q) => q.status === 'accepted')
  return (
    <section data-testid="page-accepted">
      <h1>Accepted</h1>
      <ul data-testid="accepted-list">
        {accepted.map((q) => (
          <li key={q.id} data-testid={`accepted-${q.id}`}>
            <span data-testid={`accepted-${q.id}-client`}>{q.client}</span>
            <span data-testid={`accepted-${q.id}-total`}>{total(q)}</span>
          </li>
        ))}
      </ul>
      <p data-testid="accepted-total">{acceptedTotal}</p>
    </section>
  )
}
