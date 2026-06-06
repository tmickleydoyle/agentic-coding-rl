'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
export function HomePage() {
  const { polls, votes } = useApp()
  const votesByPoll: Record<string, number> = {}
  votes.forEach(v => { votesByPoll[v.pollId] = (votesByPoll[v.pollId] || 0) + 1 })
  let popularPoll = polls[0]
  let maxVotes = 0
  polls.forEach(p => { if ((votesByPoll[p.id] || 0) >= maxVotes) { maxVotes = votesByPoll[p.id] || 0; popularPoll = p } })
  return (
    <div data-testid="home-page">
      <h1>Poll Creator</h1>
      <div data-testid="total-polls">{polls.length}</div>
      <div data-testid="total-votes">{votes.length}</div>
      <div data-testid="popular-poll">{popularPoll?.question ?? ''}</div>
    </div>
  )
}
