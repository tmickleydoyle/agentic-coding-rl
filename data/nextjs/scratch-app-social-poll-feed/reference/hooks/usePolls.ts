'use client'
import { useApp } from '../components/AppStateProvider'
import { sortByVotes, totalVotes } from '../lib/polls'

export function usePolls() {
  const { polls } = useApp()
  const trending = sortByVotes(polls)
  let allVotes = 0
  polls.forEach((p) => {
    allVotes += totalVotes(p)
  })
  const stats = { totalPolls: polls.length, totalVotes: allVotes }
  return { trending, stats }
}
