'use client'
import type { Thread } from '../lib/types'

export default function ThreadRow({
  thread,
  personName,
  onOpen,
}: {
  thread: Thread
  personName: string
  onOpen: (id: string) => void
}) {
  // TODO: render the thread row with person name, unread badge, and an open- button.
  void personName
  void onOpen
  return <li data-testid={`thread-${thread.id}`} />
}
