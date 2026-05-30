'use client'
import type { Session } from '../lib/types'

export default function SessionCard({
  session,
  onView,
}: {
  session: Session
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`session-${session.id}`}>
      <span data-testid={`session-${session.id}-title`}>{session.title}</span>
      <span data-testid={`session-${session.id}-track`}>{session.track}</span>
      <span data-testid={`session-${session.id}-slot`}>{session.slot}</span>
      <button data-testid={`view-${session.id}`} onClick={() => onView(session.id)}>
        View
      </button>
    </li>
  )
}
