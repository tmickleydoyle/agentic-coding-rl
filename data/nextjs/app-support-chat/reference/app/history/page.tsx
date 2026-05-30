'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSessions } from '../../hooks/useSessions'
import SessionRow from '../../components/SessionRow'

export default function HistoryPage() {
  const { selectSession } = useApp()
  const { closed } = useSessions()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {closed.length === 0 ? (
        <p data-testid="empty-history">No closed sessions.</p>
      ) : (
        <ul data-testid="history-list">
          {closed.map((s) => (
            <SessionRow key={s.id} session={s} onOpen={selectSession} />
          ))}
        </ul>
      )}
    </section>
  )
}
