'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addItem, markAddressed } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  const openCount = items.filter((i) => i.status === 'open').length
  const displayed = showOpenOnly ? items.filter((i) => i.status === 'open') : items

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
            addItem(note, screen)
            setNote('')
            setScreen('')
          }}
        >
          Add feedback
        </button>
      </div>
      <h2>{`Open feedback (${openCount})`}</h2>
      <label>
        <input
          type="checkbox"
          aria-label="Show open only"
          checked={showOpenOnly}
          onChange={() => setShowOpenOnly((v) => !v)}
        />
        Show open only
      </label>
      <ul>
        {displayed.map((item) => (
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
