'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
export function ResultsPage() {
  const { polls, votes } = useApp()
  return (
    <div data-testid="results-page">
      <h1>Results</h1>
      {polls.map(p => {
        const pollVotes = votes.filter(v => v.pollId === p.id)
        const total = pollVotes.length
        return (
          <div key={p.id} data-testid={`result-poll-${p.id}`}>
            <h2>{p.question}</h2>
            {p.options.map(opt => {
              const count = pollVotes.filter(v => v.option === opt).length
              const pct = total > 0 ? Math.round(count / total * 100) : 0
              return (
                <div key={opt} data-testid={`result-option-${p.id}-${opt.replace(/ /g, '-')}`}>
                  {opt}: {count} ({pct}%)
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
