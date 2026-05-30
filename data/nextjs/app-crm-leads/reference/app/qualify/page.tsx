'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLeads } from '../../hooks/useLeads'

export default function QualifyPage() {
  const { leads, qualifyLead, setScore } = useApp()
  const { avgScore } = useLeads()
  const newLeads = leads.filter((l) => l.status === 'new')

  return (
    <section data-testid="page-qualify">
      <h1>Qualify</h1>
      <span data-testid="avg-score">{avgScore}</span>
      {newLeads.length === 0 ? (
        <p data-testid="qualify-empty">Nothing to qualify.</p>
      ) : (
        <ul data-testid="qualify-list">
          {newLeads.map((l) => (
            <li key={l.id} data-testid={`qualify-${l.id}`}>
              <span data-testid={`qualify-${l.id}-name`}>{l.name}</span>
              <span data-testid={`qualify-${l.id}-score`}>{l.score}</span>
              <button data-testid={`bump-${l.id}`} onClick={() => setScore(l.id, l.score + 10)}>
                +10
              </button>
              <button data-testid={`qualify-btn-${l.id}`} onClick={() => qualifyLead(l.id)}>
                Qualify
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
