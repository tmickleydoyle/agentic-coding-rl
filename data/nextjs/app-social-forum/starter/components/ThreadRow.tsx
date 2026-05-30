'use client'
import type { Thread } from '../lib/types'

export default function ThreadRow({
  thread,
  onUpvote,
  onOpen,
}: {
  thread: Thread
  onUpvote: (id: string) => void
  onOpen: (id: string) => void
}) {
  // TODO: render the thread row with title/votes, upvote-<id> and open-<id> buttons.
  void onUpvote
  void onOpen
  return <li data-testid={`thread-${thread.id}`} />
}
