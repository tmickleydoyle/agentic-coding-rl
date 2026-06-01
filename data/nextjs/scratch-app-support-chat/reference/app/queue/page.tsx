'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSessions } from '../../hooks/useSessions'
import SessionRow from '../../components/SessionRow'

export default function QueuePage() {
  const { selectSession } = useApp()
  const { waiting } = useSessions()
  return (
    <section data-testid="page-queue">
      <h1>Queue</h1>
      {waiting.length === 0 ? (
        <p data-testid="empty-queue">The queue is empty.</p>
      ) : (
        <ul data-testid="queue-list">
          {waiting.map((s) => (
            <SessionRow key={s.id} session={s} onOpen={selectSession} />
          ))}
        </ul>
      )}
    </section>
  )
}
