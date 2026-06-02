'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addFeedback, markAddressed, showOpenOnly, toggleShowOpenOnly } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')

  const visible = showOpenOnly ? items.filter((i) => i.status === 'open') : items

  return (
    <section aria-label="Feedback view">
      <h1>{`Feedback (${visible.length})`}</h1>
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
          Add Feedback
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
              <button onClick={() => markAddressed(item.id)}>Mark Addressed</button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
