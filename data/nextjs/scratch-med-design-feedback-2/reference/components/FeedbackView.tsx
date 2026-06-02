'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addFeedback, toggleStatus, showOnlyOpen, toggleFilter } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')

  const displayed = showOnlyOpen ? items.filter((i) => i.status === 'open') : items

  return (
    <section aria-label="Feedback view">
      <h1>Feedback</h1>
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
      <button onClick={toggleFilter}>
        {showOnlyOpen ? 'Show: Open' : 'Show: All'}
      </button>
      <ul>
        {displayed.map((item) => (
          <li key={item.id}>
            <span>{`"${item.note}" on ${item.screen}`}</span>
            <span>{`Status: ${item.status}`}</span>
            <button onClick={() => toggleStatus(item.id)}>
              {item.status === 'open' ? 'Mark addressed' : 'Mark open'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
