'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addFeedback, toggleStatus } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')
  const [filter, setFilter] = useState<'all' | 'open'>('all')

  const visible = filter === 'open' ? items.filter((i) => i.status === 'open') : items

  return (
    <section aria-label="Feedback view">
      <h1>Feedback</h1>
      <div>
        <input
          aria-label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          aria-label="Screen"
          value={screen}
          onChange={(e) => setScreen(e.target.value)}
        />
        <button
          onClick={() => {
            addFeedback(note, screen)
            setNote('')
            setScreen('')
          }}
        >
          Add feedback
        </button>
      </div>
      <div role="group" aria-label="Filter options">
        <button
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          aria-pressed={filter === 'open'}
          onClick={() => setFilter('open')}
        >
          Open only
        </button>
      </div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.note}</span>
            <span>{item.screen}</span>
            <span>{item.status}</span>
            <button onClick={() => toggleStatus(item.id)}>
              {item.status === 'open' ? 'Mark addressed' : 'Reopen'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
