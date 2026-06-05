'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Checklist() {
  const { items, addItem, toggleItem, removeItem } = useApp()
  const [title, setTitle] = useState('')

  const total = items.length
  const doneCount = items.filter((it) => it.done).length
  const remaining = total - doneCount
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100)

  return (
    <section aria-label="Checklist view">
      <h1>Checklist</h1>
      <p>{`Remaining: ${remaining}`}</p>
      <p>{`Completion: ${pct}%`}</p>
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
      <ul>
        {items.map((it) => (
          <li key={it.id}>
            <label>
              <input
                type="checkbox"
                aria-label={`Done: ${it.title}`}
                checked={it.done}
                onChange={() => toggleItem(it.id)}
              />
              {it.title}
            </label>
            <button aria-label={`Remove ${it.title}`} onClick={() => removeItem(it.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
