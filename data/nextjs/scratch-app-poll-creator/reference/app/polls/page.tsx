'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Poll } from '../../lib/types'
export function PollsPage() {
  const { polls, setPolls } = useApp()
  const [question, setQuestion] = useState('')
  const [optionsText, setOptionsText] = useState('')

  const handleAdd = () => {
    if (!question) return
    const p: Poll = { id: `p${Date.now()}`, question, options: optionsText.split(',').map(s => s.trim()).filter(Boolean) }
    setPolls([...polls, p])
    setQuestion(''); setOptionsText('')
  }

  return (
    <div data-testid="polls-page">
      <h1>Polls</h1>
      <input data-testid="input-poll-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Question" />
      <input data-testid="input-poll-options" value={optionsText} onChange={e => setOptionsText(e.target.value)} placeholder="Options (comma-separated)" />
      <button data-testid="add-poll-btn" onClick={handleAdd}>Add Poll</button>
      {polls.map(p => (
        <div key={p.id} data-testid={`poll-item-${p.id}`}>
          <span>{p.question}</span>
          <span>{p.options.length} options</span>
        </div>
      ))}
    </div>
  )
}
