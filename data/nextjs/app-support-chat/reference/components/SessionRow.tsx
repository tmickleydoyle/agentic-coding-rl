'use client'
import type { Session } from '../lib/types'

export default function SessionRow({
  session,
  onOpen,
}: {
  session: Session
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`session-${session.id}`} data-status={session.status}>
      <span data-testid={`session-${session.id}-visitor`}>{session.visitor}</span>
      <span data-testid={`session-${session.id}-topic`}>{session.topic}</span>
      <span data-testid={`session-${session.id}-agent`}>{session.agent ?? 'Unassigned'}</span>
      <button data-testid={`open-${session.id}`} onClick={() => onOpen(session.id)}>
        Open
      </button>
    </li>
  )
}
