'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, removeItem, showDone } = useApp()
  const [title, setTitle] = useState('')

  const total = items.length
  const doneCount = items.filter((i) => i.done).length
  const remaining = total - doneCount
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  const visible = items.filter((i) => showDone || !i.done)

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <input
        aria-label="New item"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          addItem(title)
          setTitle('')
        }}
      >
        Add item
      </button>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <button
              aria-label={item.done ? `Mark undone ${item.title}` : `Mark done ${item.title}`}
              onClick={() => toggleItem(item.id)}
            >
              {item.done ? 'Mark undone' : 'Mark done'}
            </button>
            <button
              aria-label={`Remove ${item.title}`}
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
