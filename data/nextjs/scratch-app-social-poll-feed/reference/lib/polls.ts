import type { Poll } from './types'

// Pure helpers shared by the client hook and (conceptually) any consumer. No React here.

export function totalVotes(poll: Poll): number {
  let sum = 0
  poll.options.forEach((o) => {
    sum += o.votes
  })
  return sum
}

export function percentages(poll: Poll): Record<string, number> {
  const total = totalVotes(poll)
  const out: Record<string, number> = {}
  poll.options.forEach((o) => {
    out[o.id] = total === 0 ? 0 : Math.round((o.votes / total) * 100)
  })
  return out
}

export function sortByVotes(polls: Poll[]): Poll[] {
  return polls.slice().sort((a, b) => totalVotes(b) - totalVotes(a))
}
