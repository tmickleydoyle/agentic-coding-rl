'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function SessionDetailPage() {
  const { sessions, selectedSessionId, inAgenda, conflictsWith, addToAgenda, removeFromAgenda } =
    useApp()
  const session = sessions.find((s) => s.id === selectedSessionId)
  const [conflict, setConflict] = useState<string | null>(null)

  if (!session) {
    return (
      <section data-testid="page-session-detail">
        <h1>Session</h1>
        <p data-testid="no-session">No session selected.</p>
      </section>
    )
  }

  const added = inAgenda(session.id)

  const onAdd = () => {
    const ok = addToAgenda(session.id)
    if (!ok) {
      setConflict(conflictsWith(session.id))
    } else {
      setConflict(null)
    }
  }

  return (
    <section data-testid="page-session-detail">
      <h1 data-testid="session-title">{session.title}</h1>
      <span data-testid="session-speaker">{session.speaker}</span>
      <span data-testid="session-slot">{session.slot}</span>
      {added ? (
        <button data-testid="remove-btn" onClick={() => removeFromAgenda(session.id)}>
          Remove
        </button>
      ) : (
        <button data-testid="add-btn" onClick={onAdd}>
          Add to agenda
        </button>
      )}
      {conflict ? (
        <p data-testid="conflict-error">
          Conflicts with <span data-testid="conflict-with">{conflict}</span>
        </p>
      ) : null}
    </section>
  )
}
