'use client'
import type { Session } from '../lib/types'

export default function AgendaRow({
  session,
  onDrop,
}: {
  session: Session
  onDrop: (id: string) => void
}) {
  return (
    <li data-testid={`agenda-${session.id}`}>
      <span data-testid={`agenda-${session.id}-title`}>{session.title}</span>
      <span data-testid={`agenda-${session.id}-slot`}>{session.slot}</span>
      <button data-testid={`drop-${session.id}`} onClick={() => onDrop(session.id)}>
        Drop
      </button>
    </li>
  )
}
