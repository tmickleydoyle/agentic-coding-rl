'use client'
import type { Session } from '../lib/types'

export default function SessionRow({
  session,
  onOpen,
}: {
  session: Session
  onOpen: (id: string) => void
}) {
  // TODO: render the session row with visitor/topic/agent and an open-<id> button.
  void onOpen
  return <li data-testid={`session-${session.id}`} />
}
