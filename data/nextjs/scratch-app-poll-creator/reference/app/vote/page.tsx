'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Vote } from '../../lib/types'
export function VotePage() {
  const { polls, votes, setVotes } = useApp()
  const [selectedPollId, setSelectedPollId] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const selectedPoll = polls.find(p => p.id === selectedPollId)

  const castVote = () => {
    if (!selectedPollId || !selectedOption) return
    const v: Vote = { id: `v${Date.now()}`, pollId: selectedPollId, option: selectedOption }
    setVotes([...votes, v])
    setConfirmed(true)
    setSelectedOption('')
  }

  return (
    <div data-testid="vote-page">
      <h1>Vote</h1>
      <select data-testid="poll-select" value={selectedPollId} onChange={e => { setSelectedPollId(e.target.value); setConfirmed(false) }}>
        <option value="">Select a poll</option>
        {polls.map(p => <option key={p.id} value={p.id}>{p.question}</option>)}
      </select>
      {selectedPoll && selectedPoll.options.map(opt => (
        <label key={opt}>
          <input
            type="radio"
            data-testid={`option-${opt.replace(/ /g, '-')}`}
            name="vote-option"
            value={opt}
            checked={selectedOption === opt}
            onChange={() => setSelectedOption(opt)}
          />
          {opt}
        </label>
      ))}
      <button data-testid="cast-vote-btn" onClick={castVote}>Cast Vote</button>
      {confirmed && <div data-testid="vote-confirm">Vote cast!</div>}
    </div>
  )
}
