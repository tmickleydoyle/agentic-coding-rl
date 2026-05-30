'use client'
import type { Poll } from '../lib/types'

export default function PollCard({
  poll,
  onOpen,
}: {
  poll: Poll
  onOpen: (id: string) => void
}) {
  // TODO: render question, total votes, a voted indicator and an open-<id> button.
  void onOpen
  return <li data-testid={`poll-${poll.id}`} />
}
