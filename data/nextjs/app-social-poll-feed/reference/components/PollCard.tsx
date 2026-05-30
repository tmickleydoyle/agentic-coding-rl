'use client'
import type { Poll } from '../lib/types'
import { totalVotes } from '../lib/polls'

export default function PollCard({
  poll,
  onOpen,
}: {
  poll: Poll
  onOpen: (id: string) => void
}) {
  const voted = poll.votedOptionId !== null
  return (
    <li data-testid={`poll-${poll.id}`}>
      <span data-testid={`poll-${poll.id}-question`}>{poll.question}</span>
      <span data-testid={`poll-${poll.id}-total`}>{totalVotes(poll)}</span>
      <span data-testid={`poll-${poll.id}-voted`}>{voted ? 'Voted' : 'Not voted'}</span>
      <button data-testid={`open-${poll.id}`} onClick={() => onOpen(poll.id)}>
        Open
      </button>
    </li>
  )
}
