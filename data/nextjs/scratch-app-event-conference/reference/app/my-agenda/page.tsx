'use client'
import { useApp } from '../../components/AppStateProvider'
import AgendaRow from '../../components/AgendaRow'
import { useAgenda } from '../../hooks/useAgenda'

export default function MyAgendaPage() {
  const { removeFromAgenda } = useApp()
  const { agendaSessions, agendaCount } = useAgenda()

  return (
    <section data-testid="page-my-agenda">
      <h1>My Agenda</h1>
      <span data-testid="agenda-count">{agendaCount}</span>
      {agendaSessions.length === 0 ? (
        <p data-testid="empty-state">Your agenda is empty.</p>
      ) : (
        <ul data-testid="agenda-list">
          {agendaSessions.map((s) => (
            <AgendaRow key={s.id} session={s} onDrop={removeFromAgenda} />
          ))}
        </ul>
      )}
    </section>
  )
}
