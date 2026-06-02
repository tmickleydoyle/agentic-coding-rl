'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addItem, toggleStatus } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')
  const [showOpen, setShowOpen] = useState(false)

  const openCount = items.filter((i) => i.status === 'open').length
  const visible = showOpen ? items.filter((i) => i.status === 'open') : items

  return (
    <section aria-label="Feedback view">
      <h1>Feedback</h1>
      <p>{`Open: ${openCount}`}</p>
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
        Add
      </button>
      <button onClick={() => setShowOpen((s) => !s)}>
        {showOpen ? 'Show: Open' : 'Show: All'}
      </button>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.note}</span>
            <span>{`Screen: ${item.screen}`}</span>
            <button onClick={() => toggleStatus(item.id)}>
              {item.status === 'open' ? 'Mark addressed' : 'Mark open'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
