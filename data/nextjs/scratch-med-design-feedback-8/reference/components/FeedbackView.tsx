'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function FeedbackView() {
  const { items, addItem, toggleStatus, deleteItem } = useApp()
  const [note, setNote] = useState('')
  const [screen, setScreen] = useState('')
  const [filter, setFilter] = useState<'all' | 'open'>('all')

  const openCount = items.filter((i) => i.status === 'open').length
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
            addItem(note, screen)
            setNote('')
            setScreen('')
          }}
        >
          Add feedback
        </button>
      </div>
      <div>
        <button onClick={() => setFilter('all')}>Show all</button>
        <button onClick={() => setFilter('open')}>Show open</button>
      </div>
      <p>{`Open: ${openCount}`}</p>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.note}</span>
            <span>{item.screen}</span>
            <button onClick={() => toggleStatus(item.id)}>
              {item.status === 'open' ? 'Mark addressed' : 'Mark open'}
            </button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
