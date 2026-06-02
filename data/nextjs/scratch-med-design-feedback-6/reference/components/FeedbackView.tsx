'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addFeedback, markAddressed, showOpenOnly, toggleShowOpenOnly } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')

  const openCount = items.filter((i) => i.status === 'open').length
  const visible = showOpenOnly ? items.filter((i) => i.status === 'open') : items

  return (
    <section aria-label="Feedback view">
      <h1>{`Open feedback (${openCount})`}</h1>
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
      <label>
        <input
          type="checkbox"
          aria-label="Show open only"
          checked={showOpenOnly}
          onChange={toggleShowOpenOnly}
        />
        Show open only
      </label>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.note}</span>
            <span>{item.screen}</span>
            <span>{item.status}</span>
            {item.status === 'open' && (
              <button
                aria-label={`Mark addressed ${item.note}`}
                onClick={() => markAddressed(item.id)}
              >
                Mark addressed
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
